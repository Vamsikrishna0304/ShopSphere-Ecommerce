package com.shopsphere.dto.cart;

import com.shopsphere.model.Cart;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class CartDto {
    private Long id;
    private List<CartItemDto> items = new ArrayList<>();
    private int totalItems;
    private BigDecimal totalPrice;

    public CartDto() {
        this.totalPrice = BigDecimal.ZERO;
        this.totalItems = 0;
    }

    public static CartDto from(Cart cart) {
        if (cart == null) return new CartDto();
        CartDto dto = new CartDto();
        dto.setId(cart.getId());

        if (cart.getItems() != null) {
            List<CartItemDto> itemDtos = cart.getItems().stream()
                    .map(CartItemDto::from)
                    .collect(Collectors.toList());
            dto.setItems(itemDtos);

            int count = 0;
            BigDecimal total = BigDecimal.ZERO;
            for (CartItemDto item : itemDtos) {
                count += item.getQuantity();
                total = total.add(item.getSubtotal());
            }
            dto.setTotalItems(count);
            dto.setTotalPrice(total);
        }

        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<CartItemDto> getItems() {
        return items;
    }

    public void setItems(List<CartItemDto> items) {
        this.items = items;
    }

    public int getTotalItems() {
        return totalItems;
    }

    public void setTotalItems(int totalItems) {
        this.totalItems = totalItems;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }
}
