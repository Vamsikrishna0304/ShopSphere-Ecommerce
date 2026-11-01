package com.shopsphere.dto.review;

import com.shopsphere.model.Review;
import java.time.Instant;

public class ReviewDto {
    private Long id;
    private Long productId;
    private String reviewerName;
    private Integer rating;
    private String title;
    private String comment;
    private Instant createdAt;

    public ReviewDto() {
    }

    public static ReviewDto from(Review review) {
        if (review == null) return null;
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        if (review.getProduct() != null) {
            dto.setProductId(review.getProduct().getId());
        }
        if (review.getUser() != null) {
            dto.setReviewerName(review.getUser().getFirstName() + " " + review.getUser().getLastName());
        }
        dto.setRating(review.getRating());
        dto.setTitle(review.getTitle());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getReviewerName() {
        return reviewerName;
    }

    public void setReviewerName(String reviewerName) {
        this.reviewerName = reviewerName;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
