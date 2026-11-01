package com.shopsphere.service;

import com.shopsphere.common.PageResponse;
import com.shopsphere.common.exception.BadRequestException;
import com.shopsphere.common.exception.ResourceNotFoundException;
import com.shopsphere.dto.order.OrderDto;
import com.shopsphere.dto.order.OrderRequest;
import com.shopsphere.model.*;
import com.shopsphere.repository.CartItemRepository;
import com.shopsphere.repository.CartRepository;
import com.shopsphere.repository.OrderRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository,
                        CartRepository cartRepository,
                        CartItemRepository cartItemRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderDto createOrder(Long userId, OrderRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Your cart is empty"));

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new BadRequestException("Cannot create an order with an empty cart");
        }

        // Validate stock and calculate subtotal
        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem item : cart.getItems()) {
            Product p = item.getProduct();
            if (!p.isActive()) {
                throw new BadRequestException("Product '" + p.getName() + "' is no longer available");
            }
            if (p.getStockQuantity() < item.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product '" + p.getName() + "'. Available: " + p.getStockQuantity());
            }

            BigDecimal itemTotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            subtotal = subtotal.add(itemTotal);
        }

        // Calculate shipping and tax
        // Free shipping for orders >= $50, else $5.99
        BigDecimal shippingFee = subtotal.compareTo(BigDecimal.valueOf(50)) >= 0 ? BigDecimal.ZERO : BigDecimal.valueOf(5.99);
        BigDecimal taxRate = BigDecimal.valueOf(0.05); // 5% mock tax
        BigDecimal taxAmount = subtotal.multiply(taxRate).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = subtotal.add(shippingFee).add(taxAmount);

        String orderNumber = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        String addressSnapshot = String.format("%s, %s, %s %s, %s",
                request.getStreet(), request.getCity(), request.getState(), request.getPostalCode(), request.getCountry());

        PaymentStatus paymentStatus = request.getPaymentMethod() == PaymentMethod.COD
                ? PaymentStatus.PENDING
                : PaymentStatus.COMPLETED;

        Order order = new Order(
                orderNumber,
                user,
                subtotal,
                shippingFee,
                taxAmount,
                totalAmount,
                request.getPaymentMethod(),
                paymentStatus,
                addressSnapshot
        );

        if (paymentStatus == PaymentStatus.COMPLETED) {
            order.setStatus(OrderStatus.CONFIRMED);
        }

        // Add order items & deduct stock
        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();
            product.setStockQuantity(product.getStockQuantity() - item.getQuantity());
            productRepository.save(product);

            String primaryImage = null;
            if (product.getImages() != null && !product.getImages().isEmpty()) {
                primaryImage = product.getImages().get(0).getImageUrl();
            }

            BigDecimal lineSubtotal = item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            OrderItem orderItem = new OrderItem(
                    order,
                    product,
                    product.getName(),
                    primaryImage,
                    item.getUnitPrice(),
                    item.getQuantity(),
                    lineSubtotal
            );
            order.addItem(orderItem);
        }

        Order savedOrder = orderRepository.save(order);

        // Clear user cart
        cart.getItems().clear();
        cartItemRepository.deleteByCartId(cart.getId());
        cartRepository.save(cart);

        return OrderDto.from(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(OrderDto::from)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderByNumber(Long userId, String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", orderNumber));

        // Check ownership unless admin
        if (!order.getUser().getId().equals(userId)) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
            if (user.getRole() != Role.ROLE_ADMIN) {
                throw new BadRequestException("You do not have permission to view this order");
            }
        }

        return OrderDto.from(order);
    }

    @Transactional(readOnly = true)
    public PageResponse<OrderDto> getAllOrders(OrderStatus status, Pageable pageable) {
        Page<Order> page;
        if (status != null) {
            page = orderRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
        } else {
            page = orderRepository.findAllByOrderByCreatedAtDesc(pageable);
        }
        return PageResponse.from(page.map(OrderDto::from));
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "id", orderId));

        order.setStatus(newStatus);
        if (newStatus == OrderStatus.DELIVERED) {
            order.setPaymentStatus(PaymentStatus.COMPLETED);
        }
        Order updated = orderRepository.save(order);
        return OrderDto.from(updated);
    }
}
