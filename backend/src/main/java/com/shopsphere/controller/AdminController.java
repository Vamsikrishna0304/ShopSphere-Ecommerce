package com.shopsphere.controller;

import com.shopsphere.common.ApiResponse;
import com.shopsphere.common.PageResponse;
import com.shopsphere.dto.category.CategoryDto;
import com.shopsphere.dto.order.OrderDto;
import com.shopsphere.dto.order.OrderStatusUpdateRequest;
import com.shopsphere.dto.product.ProductCreateRequest;
import com.shopsphere.dto.product.ProductDto;
import com.shopsphere.model.OrderStatus;
import com.shopsphere.service.AdminService;
import com.shopsphere.service.CategoryService;
import com.shopsphere.service.OrderService;
import com.shopsphere.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final ProductService productService;
    private final CategoryService categoryService;
    private final OrderService orderService;

    public AdminController(AdminService adminService,
                           ProductService productService,
                           CategoryService categoryService,
                           OrderService orderService) {
        this.adminService = adminService;
        this.productService = productService;
        this.categoryService = categoryService;
        this.orderService = orderService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats() {
        Map<String, Object> stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<PageResponse<OrderDto>>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        PageResponse<OrderDto> orders = orderService.getAllOrders(status, pageable);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<ApiResponse<OrderDto>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        OrderDto order = orderService.updateOrderStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success(order, "Order status updated"));
    }

    @PostMapping("/products")
    public ResponseEntity<ApiResponse<ProductDto>> createProduct(@Valid @RequestBody ProductCreateRequest request) {
        ProductDto product = productService.createProduct(request);
        return new ResponseEntity<>(ApiResponse.success(product, "Product created successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductCreateRequest request) {
        ProductDto product = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success(product, "Product updated successfully"));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Product deleted successfully"));
    }

    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<CategoryDto>> createCategory(@Valid @RequestBody CategoryDto request) {
        CategoryDto category = categoryService.createCategory(request);
        return new ResponseEntity<>(ApiResponse.success(category, "Category created successfully"), HttpStatus.CREATED);
    }
}
