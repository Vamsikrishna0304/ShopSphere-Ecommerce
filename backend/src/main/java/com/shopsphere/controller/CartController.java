package com.shopsphere.controller;

import com.shopsphere.common.ApiResponse;
import com.shopsphere.dto.cart.AddToCartRequest;
import com.shopsphere.dto.cart.CartDto;
import com.shopsphere.dto.cart.UpdateCartItemRequest;
import com.shopsphere.security.UserPrincipal;
import com.shopsphere.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartDto>> getCart(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        CartDto cart = cartService.getCartDto(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(cart));
    }

    @PostMapping("/items")
    public ResponseEntity<ApiResponse<CartDto>> addToCart(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody AddToCartRequest request) {
        CartDto cart = cartService.addToCart(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success(cart, "Item added to cart"));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartDto>> updateCartItem(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long itemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        CartDto cart = cartService.updateCartItem(userPrincipal.getId(), itemId, request);
        return ResponseEntity.ok(ApiResponse.success(cart, "Cart updated"));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<ApiResponse<CartDto>> removeCartItem(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long itemId) {
        CartDto cart = cartService.removeCartItem(userPrincipal.getId(), itemId);
        return ResponseEntity.ok(ApiResponse.success(cart, "Item removed from cart"));
    }

    @DeleteMapping
    public ResponseEntity<ApiResponse<Void>> clearCart(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        cartService.clearCart(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "Cart cleared successfully"));
    }
}
