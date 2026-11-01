package com.shopsphere.service;

import com.shopsphere.common.exception.BadRequestException;
import com.shopsphere.common.exception.ResourceNotFoundException;
import com.shopsphere.dto.review.ReviewDto;
import com.shopsphere.dto.review.ReviewRequest;
import com.shopsphere.model.Product;
import com.shopsphere.model.Review;
import com.shopsphere.model.User;
import com.shopsphere.repository.ProductRepository;
import com.shopsphere.repository.ReviewRepository;
import com.shopsphere.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         ProductRepository productRepository,
                         UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<ReviewDto> getReviewsForProduct(Long productId) {
        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId).stream()
                .map(ReviewDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public ReviewDto addReview(Long userId, Long productId, ReviewRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        if (reviewRepository.existsByProductIdAndUserId(productId, userId)) {
            throw new BadRequestException("You have already reviewed this product");
        }

        Review review = new Review(
                product,
                user,
                request.getRating(),
                request.getTitle().trim(),
                request.getComment().trim()
        );

        Review savedReview = reviewRepository.save(review);

        // Update product statistics
        Double avg = reviewRepository.calculateAverageRating(productId);
        int count = reviewRepository.countReviewsByProductId(productId);
        product.setRatingAvg(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0);
        product.setReviewsCount(count);
        productRepository.save(product);

        return ReviewDto.from(savedReview);
    }
}
