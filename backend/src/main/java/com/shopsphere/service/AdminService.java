package com.shopsphere.service;

import com.shopsphere.model.OrderStatus;
import com.shopsphere.repository.OrderRepository;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class AdminService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public AdminService(OrderRepository orderRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        BigDecimal totalRevenue = orderRepository.calculateTotalRevenue();
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);
        long confirmedOrders = orderRepository.countByStatus(OrderStatus.CONFIRMED);
        long deliveredOrders = orderRepository.countByStatus(OrderStatus.DELIVERED);
        long totalProducts = productRepository.countActiveProducts();
        long totalUsers = userRepository.count();

        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        stats.put("totalOrders", totalOrders);
        stats.put("pendingOrders", pendingOrders);
        stats.put("confirmedOrders", confirmedOrders);
        stats.put("deliveredOrders", deliveredOrders);
        stats.put("totalProducts", totalProducts);
        stats.put("totalUsers", totalUsers);

        return stats;
    }
}
