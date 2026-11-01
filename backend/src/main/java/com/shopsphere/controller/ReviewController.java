package com.shopsphere.controller;

import com.shopsphere.common.ApiResponse;
import com.shopsphere.dto.review.ReviewDto;
import com.shopsphere.dto.review.ReviewRequest;
import com.shopsphere.security.UserPrincipal;
import com.shopsphere.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<ReviewDto>>> getProductReviews(@PathVariable Long productId) {
        List<ReviewDto> reviews = reviewService.getReviewsForProduct(productId);
        return ResponseEntity.ok(ApiResponse.success(reviews));
    }

    @PostMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<ReviewDto>> addReview(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long productId,
            @Valid @RequestBody ReviewRequest request) {
        ReviewDto review = reviewService.addReview(userPrincipal.getId(), productId, request);
        return new ResponseEntity<>(ApiResponse.success(review, "Review submitted successfully"), HttpStatus.CREATED);
    }
}
