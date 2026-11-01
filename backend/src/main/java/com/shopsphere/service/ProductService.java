package com.shopsphere.service;

import com.shopsphere.common.PageResponse;
import com.shopsphere.common.exception.BadRequestException;
import com.shopsphere.common.exception.ResourceNotFoundException;
import com.shopsphere.dto.product.ProductCreateRequest;
import com.shopsphere.dto.product.ProductDto;
import com.shopsphere.model.Category;
import com.shopsphere.model.Product;
import com.shopsphere.model.ProductImage;
import com.shopsphere.repository.CategoryRepository;
import com.shopsphere.repository.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductService(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<ProductDto> getProducts(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice,
                                                String search, Pageable pageable) {
        Page<Product> page = productRepository.searchProducts(categoryId, minPrice, maxPrice, search, pageable);
        return PageResponse.from(page.map(ProductDto::from));
    }

    @Transactional(readOnly = true)
    public ProductDto getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "slug", slug));
        return ProductDto.from(product);
    }

    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        return ProductDto.from(product);
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndActiveTrue().stream()
                .map(ProductDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductDto createProduct(ProductCreateRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        String baseSlug = request.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
        String slug = baseSlug;
        int counter = 1;
        while (productRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter++;
        }

        String sku = request.getSku();
        if (sku == null || sku.isBlank()) {
            sku = "SKU-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        } else if (productRepository.existsBySku(sku)) {
            throw new BadRequestException("SKU '" + sku + "' is already in use");
        }

        Product product = new Product(
                request.getName(),
                slug,
                request.getDescription(),
                request.getPrice(),
                request.getDiscountPrice(),
                request.getStockQuantity(),
                sku,
                category,
                request.isFeatured()
        );

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                String url = request.getImageUrls().get(i);
                if (url != null && !url.isBlank()) {
                    ProductImage img = new ProductImage(product, url.trim(), i == 0, i);
                    product.addImage(img);
                }
            }
        }

        Product saved = productRepository.save(product);
        return ProductDto.from(saved);
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductCreateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setDiscountPrice(request.getDiscountPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setCategory(category);
        product.setFeatured(request.isFeatured());

        if (request.getImageUrls() != null) {
            product.getImages().clear();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                String url = request.getImageUrls().get(i);
                if (url != null && !url.isBlank()) {
                    ProductImage img = new ProductImage(product, url.trim(), i == 0, i);
                    product.addImage(img);
                }
            }
        }

        Product updated = productRepository.save(product);
        return ProductDto.from(updated);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
        product.setActive(false);
        productRepository.save(product);
    }
}
