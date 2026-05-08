package com.stylesphere.controller;

import com.stylesphere.model.Order;
import com.stylesphere.model.User;
import com.stylesphere.repository.OrderRepository;
import com.stylesphere.repository.ProductRepository;
import com.stylesphere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardStats() {
        List<User> users = userRepository.findAll();
        List<Order> orders = orderRepository.findAll();
        Map<String, User> usersById = users.stream()
                .filter(user -> user.getId() != null)
                .collect(Collectors.toMap(User::getId, user -> user));

        double totalRevenue = orders.stream()
                .filter(order -> !"CANCELLED".equals(order.getOrderStatus()))
                .mapToDouble(this::resolveOrderTotal)
                .sum();

        List<Map<String, Object>> recentOrders = orders.stream()
                .sorted(Comparator.comparing((Order order) -> safeDate(order.getCreatedAt())).reversed())
                .limit(5)
                .map(order -> toOrderSummary(order, usersById))
                .collect(Collectors.toList());

        List<Map<String, Object>> recentUsers = users.stream()
                .sorted(Comparator.comparing((User user) -> safeDate(user.getCreatedAt())).reversed())
                .limit(5)
                .map(this::toUserSummary)
                .collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", users.size());
        stats.put("totalProducts", productRepository.count());
        stats.put("totalOrders", orders.size());
        stats.put("totalRevenue", totalRevenue);
        stats.put("processingOrders", orders.stream().filter(order -> "PROCESSING".equals(order.getOrderStatus())).count());
        stats.put("deliveredOrders", orders.stream().filter(order -> "DELIVERED".equals(order.getOrderStatus())).count());
        stats.put("cancelledOrders", orders.stream().filter(order -> "CANCELLED".equals(order.getOrderStatus())).count());
        stats.put("recentOrders", recentOrders);
        stats.put("recentUsers", recentUsers);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll().stream()
                .sorted(Comparator.comparing((User user) -> safeDate(user.getCreatedAt())).reversed())
                .map(this::toUserSummary)
                .collect(Collectors.toList()));
    }

    @GetMapping("/orders")
    public ResponseEntity<?> getAllOrders() {
        Map<String, User> usersById = userRepository.findAll().stream()
                .filter(user -> user.getId() != null)
                .collect(Collectors.toMap(User::getId, user -> user));

        return ResponseEntity.ok(orderRepository.findAll().stream()
                .sorted(Comparator.comparing((Order order) -> safeDate(order.getCreatedAt())).reversed())
                .map(order -> toOrderSummary(order, usersById))
                .collect(Collectors.toList()));
    }

    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        return orderRepository.findById(id).map(order -> {
            order.setOrderStatus(body.get("status"));
            return ResponseEntity.ok(orderRepository.save(order));
        }).orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> toOrderSummary(Order order, Map<String, User> usersById) {
        User user = order.getUserId() != null ? usersById.get(order.getUserId()) : null;
        String customerName = order.getShippingAddress() != null && order.getShippingAddress().getName() != null
                ? order.getShippingAddress().getName()
                : buildUserName(user);
        String customerEmail = user != null && user.getEmail() != null ? user.getEmail() : "-";
        String customerPhone = order.getShippingAddress() != null && order.getShippingAddress().getPhone() != null
                ? order.getShippingAddress().getPhone()
                : user != null && user.getPhone() != null ? user.getPhone() : "-";
        int itemCount = order.getItems() == null ? 0 : order.getItems().stream()
                .map(item -> item.getQuantity() != null ? item.getQuantity() : 0)
                .mapToInt(Integer::intValue)
                .sum();

        Map<String, Object> summary = new HashMap<>();
        summary.put("id", order.getId());
        summary.put("userId", order.getUserId());
        summary.put("customerName", customerName);
        summary.put("customerEmail", customerEmail);
        summary.put("customerPhone", customerPhone);
        summary.put("itemCount", itemCount);
        summary.put("total", resolveOrderTotal(order));
        summary.put("status", order.getOrderStatus());
        summary.put("paymentMethod", order.getPaymentMethod());
        summary.put("paymentStatus", order.getPaymentStatus());
        summary.put("createdAt", order.getCreatedAt());
        summary.put("shippingLocation", order.getShippingAddress() != null
                ? joinLocation(order.getShippingAddress().getCity(), order.getShippingAddress().getState())
                : "-");
        return summary;
    }

    private Map<String, Object> toUserSummary(User user) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("id", user.getId());
        summary.put("firstName", user.getFirstName());
        summary.put("lastName", user.getLastName());
        summary.put("fullName", buildUserName(user));
        summary.put("email", user.getEmail());
        summary.put("phone", user.getPhone());
        summary.put("role", user.getRole());
        summary.put("createdAt", user.getCreatedAt());
        return summary;
    }

    private String buildUserName(User user) {
        if (user == null) {
            return "Unknown customer";
        }

        String fullName = joinName(user.getFirstName(), user.getLastName());
        return "-".equals(fullName) ? "Unknown customer" : fullName;
    }

    private String joinName(String first, String second) {
        StringBuilder builder = new StringBuilder();

        if (first != null && !first.isBlank()) {
            builder.append(first.trim());
        }

        if (second != null && !second.isBlank()) {
            if (builder.length() > 0) {
                builder.append(" ");
            }
            builder.append(second.trim());
        }

        return builder.length() > 0 ? builder.toString() : "-";
    }

    private String joinLocation(String city, String state) {
        StringBuilder builder = new StringBuilder();

        if (city != null && !city.isBlank()) {
            builder.append(city.trim());
        }

        if (state != null && !state.isBlank()) {
            if (builder.length() > 0) {
                builder.append(", ");
            }
            builder.append(state.trim());
        }

        return builder.length() > 0 ? builder.toString() : "-";
    }

    private LocalDateTime safeDate(LocalDateTime dateTime) {
        return dateTime != null ? dateTime : LocalDateTime.MIN;
    }

    private double resolveOrderTotal(Order order) {
        if (order == null) {
            return 0.0;
        }

        if (order.getTotalDiscountedPrice() != null) {
            return order.getTotalDiscountedPrice();
        }

        if (order.getTotalPrice() != null) {
            return order.getTotalPrice();
        }

        return 0.0;
    }
}
