package com.shopsphere.dto.order;

import com.shopsphere.model.Order;
import com.shopsphere.model.OrderStatus;
import com.shopsphere.model.PaymentMethod;
import com.shopsphere.model.PaymentStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class OrderDto {
    private Long id;
    private String orderNumber;
    private String customerEmail;
    private String customerName;
    private List<OrderItemDto> items = new ArrayList<>();
    private BigDecimal subtotal;
    private BigDecimal shippingFee;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private PaymentMethod paymentMethod;
    private PaymentStatus paymentStatus;
    private String shippingAddressSnapshot;
    private Instant createdAt;

    public OrderDto() {
    }

    public static OrderDto from(Order order) {
        if (order == null) return null;
        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setOrderNumber(order.getOrderNumber());
        if (order.getUser() != null) {
            dto.setCustomerEmail(order.getUser().getEmail());
            dto.setCustomerName(order.getUser().getFirstName() + " " + order.getUser().getLastName());
        }
        if (order.getItems() != null) {
            dto.setItems(order.getItems().stream()
                    .map(OrderItemDto::from)
                    .collect(Collectors.toList()));
        }
        dto.setSubtotal(order.getSubtotal());
        dto.setShippingFee(order.getShippingFee());
        dto.setTaxAmount(order.getTaxAmount());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setStatus(order.getStatus());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setPaymentStatus(order.getPaymentStatus());
        dto.setShippingAddressSnapshot(order.getShippingAddressSnapshot());
        dto.setCreatedAt(order.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public List<OrderItemDto> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDto> items) {
        this.items = items;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(BigDecimal shippingFee) {
        this.shippingFee = shippingFee;
    }

    public BigDecimal getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(BigDecimal taxAmount) {
        this.taxAmount = taxAmount;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public String getShippingAddressSnapshot() {
        return shippingAddressSnapshot;
    }

    public void setShippingAddressSnapshot(String shippingAddressSnapshot) {
        this.shippingAddressSnapshot = shippingAddressSnapshot;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
