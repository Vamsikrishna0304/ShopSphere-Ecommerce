package com.shopsphere.service;

import com.shopsphere.common.exception.BadRequestException;
import com.shopsphere.common.exception.ResourceNotFoundException;
import com.shopsphere.dto.cart.AddToCartRequest;
import com.shopsphere.dto.cart.CartDto;
import com.shopsphere.dto.cart.UpdateCartItemRequest;
import com.shopsphere.model.Cart;
import com.shopsphere.model.CartItem;
import com.shopsphere.model.Product;
import com.shopsphere.model.User;
import com.shopsphere.repository.CartItemRepository;
import com.shopsphere.repository.CartRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
            Cart newCart = new Cart(user);
            return cartRepository.save(newCart);
        });
    }

    @Transactional(readOnly = true)
    public CartDto getCartDto(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return CartDto.from(cart);
    }

    @Transactional
    public CartDto addToCart(Long userId, AddToCartRequest request) {
        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        if (!product.isActive()) {
            throw new BadRequestException("This product is no longer active");
        }

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock available (Available: " + product.getStockQuantity() + ")");
        }

        BigDecimal activePrice = product.getDiscountPrice() != null ? product.getDiscountPrice() : product.getPrice();

        Optional<CartItem> existingItem = cartItemRepository.findByCartIdAndProductId(cart.getId(), product.getId());
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + request.getQuantity();
            if (product.getStockQuantity() < newQuantity) {
                throw new BadRequestException("Cannot add more. Available stock: " + product.getStockQuantity());
            }
            item.setQuantity(newQuantity);
            item.setUnitPrice(activePrice);
            cartItemRepository.save(item);
        } else {
            CartItem item = new CartItem(cart, product, request.getQuantity(), activePrice);
            cart.addItem(item);
            cartItemRepository.save(item);
        }

        cartRepository.save(cart);
        return CartDto.from(cart);
    }

    @Transactional
    public CartDto updateCartItem(Long userId, Long cartItemId, UpdateCartItemRequest request) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", cartItemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to your cart");
        }

        if (item.getProduct().getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock. Available: " + item.getProduct().getStockQuantity());
        }

        item.setQuantity(request.getQuantity());
        BigDecimal activePrice = item.getProduct().getDiscountPrice() != null
                ? item.getProduct().getDiscountPrice()
                : item.getProduct().getPrice();
        item.setUnitPrice(activePrice);

        cartItemRepository.save(item);
        return CartDto.from(cart);
    }

    @Transactional
    public CartDto removeCartItem(Long userId, Long cartItemId) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("CartItem", "id", cartItemId));

        if (!item.getCart().getId().equals(cart.getId())) {
            throw new BadRequestException("Item does not belong to your cart");
        }

        cart.removeItem(item);
        cartItemRepository.delete(item);
        return CartDto.from(cart);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartItemRepository.deleteByCartId(cart.getId());
        cartRepository.save(cart);
    }
}
