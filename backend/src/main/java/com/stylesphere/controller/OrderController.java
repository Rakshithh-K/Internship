package com.stylesphere.controller;

import com.stylesphere.model.Order;
import com.stylesphere.repository.OrderRepository;
import com.stylesphere.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    private String getUserId(Authentication auth) {
        return ((UserDetailsImpl) auth.getPrincipal()).getId();
    }

    @GetMapping
    public ResponseEntity<List<Order>> getUserOrders(Authentication auth) {
        return ResponseEntity.ok(orderRepository.findByUserId(getUserId(auth)));
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order, Authentication auth) {
        order.setUserId(getUserId(auth));
        order.setCreatedAt(LocalDateTime.now());
        order.setOrderStatus("PROCESSING");
        order.setPaymentStatus("COMPLETED"); // Assuming payment successful for now
        return ResponseEntity.ok(orderRepository.save(order));
    }
}
