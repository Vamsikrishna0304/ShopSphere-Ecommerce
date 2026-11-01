package com.shopsphere.dto.cart;

import com.shopsphere.dto.product.ProductDto;
import com.shopsphere.model.CartItem;

import java.math.BigDecimal;

public class CartItemDto {
    private Long id;
    private ProductDto product;
    private Integer quantity;
    private BigDecimal unitPrice;
    private BigDecimal subtotal;

    public CartItemDto() {
    }

    public static CartItemDto from(CartItem item) {
        if (item == null) return null;
        CartItemDto dto = new CartItemDto();
        dto.setId(item.getId());
        dto.setProduct(ProductDto.from(item.getProduct()));
        dto.setQuantity(item.getQuantity());
        dto.setUnitPrice(item.getUnitPrice());
        dto.setSubtotal(item.getUnitPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProductDto getProduct() {
        return product;
    }

    public void setProduct(ProductDto product) {
        this.product = product;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }
}
