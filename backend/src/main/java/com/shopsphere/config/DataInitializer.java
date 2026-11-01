package com.shopsphere.config;

import com.shopsphere.model.*;
import com.shopsphere.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           ProductRepository productRepository,
                           CartRepository cartRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.cartRepository = cartRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedUsers();
        seedCategoriesAndProducts();
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@shopsphere.com")) {
            User admin = new User("admin@shopsphere.com", passwordEncoder.encode("Admin@123"), "Admin", "Sphere", Role.ROLE_ADMIN);
            admin.setPhone("+1-555-0100");
            userRepository.save(admin);
            logger.info("Seeded Admin Account: admin@shopsphere.com / Admin@123");
        }

        if (!userRepository.existsByEmail("customer@shopsphere.com")) {
            User customer = new User("customer@shopsphere.com", passwordEncoder.encode("Customer@123"), "Alex", "Morgan", Role.ROLE_CUSTOMER);
            customer.setPhone("+1-555-0199");
            User saved = userRepository.save(customer);

            Cart cart = new Cart(saved);
            cartRepository.save(cart);
            logger.info("Seeded Customer Account: customer@shopsphere.com / Customer@123");
        }
    }

    private void seedCategoriesAndProducts() {
        if (categoryRepository.count() > 0) {
            return;
        }

        logger.info("Seeding initial categories and realistic catalog products...");

        Category electronics = categoryRepository.save(new Category(
                "Electronics", "electronics", "Smartphones, laptops, monitors, and smart home technology",
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80"
        ));

        Category audio = categoryRepository.save(new Category(
                "Audio & Gadgets", "audio-gadgets", "Noise-cancelling headphones, high-fidelity earbuds, and speakers",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
        ));

        Category fashion = categoryRepository.save(new Category(
                "Fashion & Apparel", "fashion", "Contemporary streetwear, luxury essentials, and watches",
                "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&auto=format&fit=crop&q=80"
        ));

        Category home = categoryRepository.save(new Category(
                "Home & Living", "home-living", "Modern aesthetic decor, artisan ceramics, and workspace setups",
                "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80"
        ));

        Category sports = categoryRepository.save(new Category(
                "Sports & Outdoors", "sports-outdoors", "Performance athletic gear, smart fitness trackers, and equipment",
                "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"
        ));

        // Seed Products
        createProduct(
                "Aura Pro Wireless ANC Headphones",
                "aura-pro-wireless-anc-headphones",
                "Experience studio-grade acoustics with our hybrid active noise cancellation, 40mm beryllium drivers, 38-hour battery life, and ultra-plush memory foam ear cups for all-day listening comfort.",
                new BigDecimal("299.99"),
                new BigDecimal("249.99"),
                45,
                "SKU-AUR-01",
                audio,
                true,
                4.8,
                128,
                List.of(
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80"
                )
        );

        createProduct(
                "Horizon 4K OLED Ultra-Thin Monitor",
                "horizon-4k-oled-ultra-thin-monitor",
                "A stunning 27-inch 4K OLED display featuring 99% DCI-P3 color accuracy, 144Hz refresh rate, 0.1ms response time, USB-C 90W power delivery, and an anodized aluminum bezel.",
                new BigDecimal("799.00"),
                new BigDecimal("699.00"),
                18,
                "SKU-MON-02",
                electronics,
                true,
                4.9,
                84,
                List.of(
                        "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=800&auto=format&fit=crop&q=80"
                )
        );

        createProduct(
                "Luminary Minimalist Mechanical Keyboard",
                "luminary-minimalist-mechanical-keyboard",
                "Crafted with custom lubed linear switches, hot-swappable PCB, south-facing RGB backlighting, custom PBT dye-sub keycaps, and seamless Bluetooth 5.2 / 2.4GHz multi-device pairing.",
                new BigDecimal("159.00"),
                new BigDecimal("129.00"),
                60,
                "SKU-KBD-03",
                electronics,
                true,
                4.7,
                95,
                List.of(
                        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80"
                )
        );

        createProduct(
                "Vanguard Chronograph Heritage Watch",
                "vanguard-chronograph-heritage-watch",
                "Precision Swiss automatic movement encased in 316L brushed surgical stainless steel. Finished with sapphire crystal glass and genuine Italian vegetable-tanned leather strap.",
                new BigDecimal("349.50"),
                new BigDecimal("299.00"),
                25,
                "SKU-WCH-04",
                fashion,
                true,
                4.9,
                112,
                List.of(
                        "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&auto=format&fit=crop&q=80",
                        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80"
                )
        );

        createProduct(
                "Nomad Waterproof Roll-Top Commuter Backpack",
                "nomad-waterproof-roll-top-commuter-backpack",
                "Built from weatherproof 840D recycled Cordura nylon, featuring a dedicated 16-inch padded laptop compartment, magnetic Fidlock buckle closures, and ergonomic ventilated shoulder harnesses.",
                new BigDecimal("119.00"),
                null,
                75,
                "SKU-BCK-05",
                fashion,
                false,
                4.6,
                67,
                List.of(
                        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80"
                )
        );

        createProduct(
                "Ceramic Pour-Over Artisan Coffee Set",
                "ceramic-pour-over-artisan-coffee-set",
                "Handcrafted stoneware dripper with double-walled thermal glass carafe and precision stainless steel reusable mesh filter. Designed for pure, aromatic specialty coffee brewing.",
                new BigDecimal("68.00"),
                new BigDecimal("54.99"),
                50,
                "SKU-COF-06",
                home,
                false,
                4.8,
                53,
                List.of(
                        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80"
                )
        );

        createProduct(
                "Apex Pulse Smart Fitness Tracker",
                "apex-pulse-smart-fitness-tracker",
                "Continuous heart rate variability, SpO2 monitoring, GPS workout tracking, sleep staging metrics, and 14-day battery reserve with 50m water resistance rating.",
                new BigDecimal("139.99"),
                new BigDecimal("109.99"),
                80,
                "SKU-FIT-07",
                sports,
                true,
                4.5,
                142,
                List.of(
                        "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80"
                )
        );

        createProduct(
                "SonicWave Portable Waterproof Bluetooth Speaker",
                "sonicwave-portable-waterproof-speaker",
                "360-degree room-filling audio with dual passive radiators, punchy bass, IP67 dustproof and waterproof rating, and 24 hours of non-stop playback on a single charge.",
                new BigDecimal("89.00"),
                new BigDecimal("74.50"),
                90,
                "SKU-SPK-08",
                audio,
                false,
                4.6,
                88,
                List.of(
                        "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80"
                )
        );

        createProduct(
                "Zenith Ambient Sculptural Desk Lamp",
                "zenith-ambient-sculptural-desk-lamp",
                "An architectural minimalist desk lamp with capacitive step-less dimming, 2700K to 6500K dynamic color temperature, and built-in 15W Qi fast wireless charging base.",
                new BigDecimal("95.00"),
                null,
                35,
                "SKU-LMP-09",
                home,
                false,
                4.7,
                41,
                List.of(
                        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80"
                )
        );

        logger.info("Successfully seeded catalog data!");
    }

    private void createProduct(String name, String slug, String description, BigDecimal price,
                               BigDecimal discountPrice, int stock, String sku, Category category,
                               boolean featured, double rating, int reviewsCount, List<String> images) {
        Product p = new Product(name, slug, description, price, discountPrice, stock, sku, category, featured);
        p.setRatingAvg(rating);
        p.setReviewsCount(reviewsCount);

        for (int i = 0; i < images.size(); i++) {
            p.addImage(new ProductImage(p, images.get(i), i == 0, i));
        }

        productRepository.save(p);
    }
}
