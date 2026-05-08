package com.stylesphere.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {
    private String productId;
    private String name;
    private String image;
    private Double price;
    private Double discountedPrice;
    private String brand;
    private String size;
    private String color;
    private Integer quantity;
}
