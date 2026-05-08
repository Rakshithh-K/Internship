package com.stylesphere.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {

    @Id
    private String id;

    private String name;
    private String description;
    private String brand;
    private String category; // category slug
    private String gender; // Men, Women, Unisex

    private Double price;
    private Integer discountPercent;
    private Double discountedPrice;

    private List<String> sizes;
    private List<String> colors;
    private List<String> images;

    private Integer stock;
    private Double ratings;
    private Integer reviewCount;

    private Boolean featured;
    private Boolean trending;

    @CreatedDate
    private LocalDateTime createdAt;
}
