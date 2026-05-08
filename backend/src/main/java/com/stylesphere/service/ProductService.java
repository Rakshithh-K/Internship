package com.stylesphere.service;

import com.stylesphere.model.Product;
import com.stylesphere.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public Page<Product> getAllProducts(Pageable pageable, String category, String gender, String brand, String search) {
        List<Product> allProducts = productRepository.findAll();
        
        List<Product> filtered = allProducts.stream()
                .filter(p -> category == null || category.isEmpty() || p.getCategory().equalsIgnoreCase(category))
                .filter(p -> gender == null || gender.isEmpty() || p.getGender().equalsIgnoreCase(gender))
                .filter(p -> brand == null || brand.isEmpty() || p.getBrand().equalsIgnoreCase(brand))
                .filter(p -> search == null || search.isEmpty() || p.getName().toLowerCase().contains(search.toLowerCase()))
                .collect(Collectors.toList());
                
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filtered.size());
        
        List<Product> pageContent = start <= end ? filtered.subList(start, end) : List.of();
        return new PageImpl<>(pageContent, pageable, filtered.size());
    }

    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    public Product addProduct(Product product) {
        if (product.getDiscountPercent() != null && product.getDiscountPercent() > 0) {
            product.setDiscountedPrice(product.getPrice() - (product.getPrice() * product.getDiscountPercent() / 100));
        } else {
            product.setDiscountedPrice(product.getPrice());
        }
        return productRepository.save(product);
    }

    public Product updateProduct(String id, Product productDetails) {
        return productRepository.findById(id).map(product -> {
            product.setName(productDetails.getName());
            product.setDescription(productDetails.getDescription());
            product.setBrand(productDetails.getBrand());
            product.setCategory(productDetails.getCategory());
            product.setGender(productDetails.getGender());
            product.setPrice(productDetails.getPrice());
            product.setDiscountPercent(productDetails.getDiscountPercent());
            
            if (productDetails.getDiscountPercent() != null && productDetails.getDiscountPercent() > 0) {
                product.setDiscountedPrice(productDetails.getPrice() - (productDetails.getPrice() * productDetails.getDiscountPercent() / 100));
            } else {
                product.setDiscountedPrice(productDetails.getPrice());
            }

            product.setSizes(productDetails.getSizes());
            product.setColors(productDetails.getColors());
            product.setImages(productDetails.getImages());
            product.setStock(productDetails.getStock());
            product.setFeatured(productDetails.getFeatured());
            product.setTrending(productDetails.getTrending());
            
            return productRepository.save(product);
        }).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
}
