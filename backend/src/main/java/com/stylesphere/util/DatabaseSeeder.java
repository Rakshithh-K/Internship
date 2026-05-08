package com.stylesphere.util;

import com.stylesphere.model.Product;
import com.stylesphere.model.User;
import com.stylesphere.repository.ProductRepository;
import com.stylesphere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    @Value("${app.seed.adminFirstName:Admin}")
    private String adminFirstName;

    @Value("${app.seed.adminLastName:User}")
    private String adminLastName;

    @Value("${app.seed.adminEmail:admin@stylesphere.com}")
    private String adminEmail;

    @Value("${app.seed.adminPassword:admin123}")
    private String adminPassword;

    @Value("${app.seed.adminPhone:9999999999}")
    private String adminPhone;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedProducts();
    }

    private void seedUsers() {
        if (userRepository.count() == 0) {
            User admin = User.builder()
                    .firstName(adminFirstName)
                    .lastName(adminLastName)
                    .email(adminEmail.trim().toLowerCase())
                    .password(passwordEncoder.encode(adminPassword))
                    .phone(adminPhone)
                    .role("ADMIN")
                    .createdAt(LocalDateTime.now())
                    .build();

            User user = User.builder()
                    .firstName("Test")
                    .lastName("User")
                    .email("user@stylesphere.com")
                    .password(passwordEncoder.encode("user123"))
                    .phone("8888888888")
                    .role("USER")
                    .createdAt(LocalDateTime.now())
                    .build();

            userRepository.saveAll(List.of(admin, user));
            System.out.println("Seeded admin and test users.");
        }
    }

    private void seedProducts() {
        if (productRepository.count() == 0) {
            List<Product> products = List.of(
                    Product.builder()
                            .name("Premium Cotton Slim Fit Shirt")
                            .brand("Zara")
                            .category("top-wear")
                            .gender("Men")
                            .price(2499.0)
                            .discountPercent(20)
                            .discountedPrice(1999.0)
                            .sizes(List.of("S", "M", "L", "XL"))
                            .colors(List.of("Navy", "White", "Black"))
                            .stock(50)
                            .ratings(4.5)
                            .reviewCount(120)
                            .featured(true)
                            .trending(true)
                            .images(List.of(
                                    "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=600&h=780&fit=crop"))
                            .createdAt(LocalDateTime.now())
                            .description("Premium cotton shirt suitable for casual and formal wear.")
                            .build(),
                    Product.builder()
                            .name("Classic Denim Jacket")
                            .brand("Levi's")
                            .category("outerwear")
                            .gender("Unisex")
                            .price(4999.0)
                            .discountPercent(10)
                            .discountedPrice(4499.0)
                            .sizes(List.of("M", "L", "XL"))
                            .colors(List.of("Blue", "Black"))
                            .stock(30)
                            .ratings(4.8)
                            .reviewCount(340)
                            .featured(true)
                            .trending(true)
                            .images(List.of(
                                    "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=600&h=780&fit=crop"))
                            .createdAt(LocalDateTime.now())
                            .description("Classic denim jacket that never goes out of style.")
                            .build(),
                    Product.builder()
                            .name("Floral Summer Dress")
                            .brand("H&M")
                            .category("dresses")
                            .gender("Women")
                            .price(3499.0)
                            .discountPercent(25)
                            .discountedPrice(2624.0)
                            .sizes(List.of("XS", "S", "M", "L"))
                            .colors(List.of("Red", "Yellow", "Blue"))
                            .stock(40)
                            .ratings(4.6)
                            .reviewCount(210)
                            .featured(true)
                            .trending(true)
                            .images(List.of(
                                    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=780&fit=crop"))
                            .createdAt(LocalDateTime.now())
                            .description("Beautiful floral dress perfect for summer outings.")
                            .build(),
                    Product.builder()
                            .name("Running Sneakers")
                            .brand("Nike")
                            .category("footwear")
                            .gender("Unisex")
                            .price(7999.0)
                            .discountPercent(0)
                            .discountedPrice(7999.0)
                            .sizes(List.of("7", "8", "9", "10", "11"))
                            .colors(List.of("Black", "White"))
                            .stock(25)
                            .ratings(4.9)
                            .reviewCount(560)
                            .featured(false)
                            .trending(true)
                            .images(List.of(
                                    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=780&fit=crop"))
                            .createdAt(LocalDateTime.now())
                            .description("High-performance running sneakers.")
                            .build());

            productRepository.saveAll(products);
            System.out.println("Seeded 4 sample products.");
        }
    }
}
