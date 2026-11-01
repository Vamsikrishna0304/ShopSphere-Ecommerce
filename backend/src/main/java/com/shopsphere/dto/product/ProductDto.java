
package com.shopsphere.dto.product;

import com.shopsphere.dto.category.CategoryDto;
import com.shopsphere.model.Product;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class ProductDto {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private BigDecimal price;
    private BigDecimal discountPrice;
    private Integer stockQuantity;
    private String sku;
    private CategoryDto category;
    private List<ProductImageDto> images = new ArrayList<>();
    private String primaryImageUrl;
    private boolean active;
    private boolean featured;
    private Double ratingAvg;
    private Integer reviewsCount;
    private Instant createdAt;

    public ProductDto() {
    }

    public static ProductDto from(Product product) {
        if (product == null) {
            return null;
        }

        ProductDto dto = new ProductDto();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setSlug(product.getSlug());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setDiscountPrice(product.getDiscountPrice());
        dto.setStockQuantity(product.getStockQuantity());
        dto.setSku(product.getSku());
        dto.setCategory(CategoryDto.from(product.getCategory()));
        dto.setActive(product.isActive());
        dto.setFeatured(product.isFeatured());
        dto.setRatingAvg(product.getRatingAvg());
        dto.setReviewsCount(product.getReviewsCount());
        dto.setCreatedAt(product.getCreatedAt());

        if (product.getImages() != null) {
            dto.setImages(product.getImages().stream()
                    .map(ProductImageDto::from)
                    .collect(Collectors.toList()));

            String primary = product.getImages().stream()
                    .filter(image -> image.isPrimary())
                    .findFirst()
                    .map(image -> image.getImageUrl())
                    .orElse(null);

            if (primary == null && !product.getImages().isEmpty()) {
                primary = product.getImages().get(0).getImageUrl();
            }

            dto.setPrimaryImageUrl(primary);
        }

        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public BigDecimal getDiscountPrice() {
        return discountPrice;
    }

    public void setDiscountPrice(BigDecimal discountPrice) {
        this.discountPrice = discountPrice;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public CategoryDto getCategory() {
        return category;
    }

    public void setCategory(CategoryDto category) {
        this.category = category;
    }

    public List<ProductImageDto> getImages() {
        return images;
    }

    public void setImages(List<ProductImageDto> images) {
        this.images = images;
    }

    public String getPrimaryImageUrl() {
        return primaryImageUrl;
    }

    public void setPrimaryImageUrl(String primaryImageUrl) {
        this.primaryImageUrl = primaryImageUrl;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isFeatured() {
        return featured;
    }

    public void setFeatured(boolean featured) {
        this.featured = featured;
    }

    public Double getRatingAvg() {
        return ratingAvg;
    }

    public void setRatingAvg(Double ratingAvg) {
        this.ratingAvg = ratingAvg;
    }

    public Integer getReviewsCount() {
        return reviewsCount;
    }

    public void setReviewsCount(Integer reviewsCount) {
        this.reviewsCount = reviewsCount;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
