package com.shopsphere.controller;

import com.shopsphere.common.ApiResponse;
import com.shopsphere.dto.order.OrderDto;
import com.shopsphere.dto.order.OrderRequest;
import com.shopsphere.security.UserPrincipal;
import com.shopsphere.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody OrderRequest request) {
        OrderDto order = orderService.createOrder(userPrincipal.getId(), request);
        return new ResponseEntity<>(ApiResponse.success(order, "Order placed successfully"), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderDto>>> getMyOrders(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<OrderDto> orders = orderService.getUserOrders(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderByNumber(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable String orderNumber) {
        OrderDto order = orderService.getOrderByNumber(userPrincipal.getId(), orderNumber);
        return ResponseEntity.ok(ApiResponse.success(order));
    }
}
