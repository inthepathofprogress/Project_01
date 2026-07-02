package com.suvida.productservice.seeder;

import com.suvida.productservice.model.Product;
import com.suvida.productservice.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ProductDataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        if (productRepository.count() == 0) {
            seedProducts();
        }
    }

    private void seedProducts() {
        List<Product> products = new ArrayList<>();

        // Electronics
        products.add(createProduct("Laptop Pro 15", "High-performance laptop with 16GB RAM and 512GB SSD",
            new BigDecimal("1299.99"), "Electronics", "TechBrand",
            "https://via.placeholder.com/300x200?text=Laptop", 50));

        products.add(createProduct("Wireless Mouse", "Ergonomic wireless mouse with 6 buttons",
            new BigDecimal("29.99"), "Electronics", "TechBrand",
            "https://via.placeholder.com/300x200?text=Mouse", 200));

        products.add(createProduct("4K Monitor", "27-inch 4K Ultra HD Monitor",
            new BigDecimal("399.99"), "Electronics", "ViewMax",
            "https://via.placeholder.com/300x200?text=Monitor", 75));

        products.add(createProduct("Smartphone X", "Latest smartphone with 128GB storage",
            new BigDecimal("899.99"), "Electronics", "PhoneTech",
            "https://via.placeholder.com/300x200?text=Smartphone", 100));

        // Clothing
        products.add(createProduct("Classic T-Shirt", "100% cotton comfortable t-shirt",
            new BigDecimal("19.99"), "Clothing", "FashionHub",
            "https://via.placeholder.com/300x200?text=TShirt", 300));

        products.add(createProduct("Denim Jeans", "Stylish slim-fit denim jeans",
            new BigDecimal("49.99"), "Clothing", "DenimCo",
            "https://via.placeholder.com/300x200?text=Jeans", 150));

        products.add(createProduct("Winter Jacket", "Warm winter jacket with hood",
            new BigDecimal("89.99"), "Clothing", "WinterWear",
            "https://via.placeholder.com/300x200?text=Jacket", 100));

        // Books
        products.add(createProduct("Java Programming Guide", "Comprehensive guide to Java programming",
            new BigDecimal("45.99"), "Books", "TechBooks",
            "https://via.placeholder.com/300x200?text=Java+Book", 120));

        products.add(createProduct("Web Development Handbook", "Modern web development techniques",
            new BigDecimal("39.99"), "Books", "CodePress",
            "https://via.placeholder.com/300x200?text=Web+Book", 90));

        // Home & Garden
        products.add(createProduct("Coffee Maker", "Automatic coffee maker with timer",
            new BigDecimal("79.99"), "Home & Garden", "HomeEssentials",
            "https://via.placeholder.com/300x200?text=Coffee+Maker", 80));

        products.add(createProduct("Plant Pot Set", "Set of 3 decorative plant pots",
            new BigDecimal("24.99"), "Home & Garden", "GardenPro",
            "https://via.placeholder.com/300x200?text=Plant+Pots", 200));

        // Sports
        products.add(createProduct("Yoga Mat", "Non-slip yoga mat with carry strap",
            new BigDecimal("34.99"), "Sports", "FitGear",
            "https://via.placeholder.com/300x200?text=Yoga+Mat", 150));

        products.add(createProduct("Dumbbells Set", "Adjustable dumbbells 5-25 lbs",
            new BigDecimal("129.99"), "Sports", "PowerFit",
            "https://via.placeholder.com/300x200?text=Dumbbells", 60));

        productRepository.saveAll(products);
        System.out.println("✅ Sample products seeded successfully!");
    }

    private Product createProduct(String name, String description, BigDecimal price,
                                   String category, String brand, String imageUrl, Integer stock) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setCategory(category);
        product.setBrand(brand);
        product.setImageUrl(imageUrl);
        product.setStockQuantity(stock);
        product.setActive(true);
        product.setRating(4.0 + (Math.random() * 1.0));
        product.setReviewCount((int) (Math.random() * 100));
        product.setCreatedAt(LocalDateTime.now());
        product.setUpdatedAt(LocalDateTime.now());
        return product;
    }
}

