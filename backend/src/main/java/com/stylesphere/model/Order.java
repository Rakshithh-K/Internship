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
@Document(collection = "orders")
public class Order {

    @Id
    private String id;

    private String userId;

    private List<CartItem> items;
    private Address shippingAddress;

    private Double totalPrice;
    private Double totalDiscountedPrice;
    private String couponCode;

    private String paymentMethod;
    private String paymentStatus; // PENDING, COMPLETED, FAILED
    private String orderStatus; // PROCESSING, SHIPPED, DELIVERED, CANCELLED

    @CreatedDate
    private LocalDateTime createdAt;
}
