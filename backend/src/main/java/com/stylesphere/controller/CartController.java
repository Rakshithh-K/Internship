package com.stylesphere.controller;

import com.stylesphere.model.Cart;
import com.stylesphere.model.CartItem;
import com.stylesphere.repository.CartRepository;
import com.stylesphere.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartRepository cartRepository;

    private String getUserId(Authentication auth) {
        return ((UserDetailsImpl) auth.getPrincipal()).getId();
    }

    @GetMapping
    public ResponseEntity<Cart> getCart(Authentication auth) {
        String userId = getUserId(auth);
        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUserId(userId);
            newCart.setItems(new ArrayList<>());
            return cartRepository.save(newCart);
        });
        return ResponseEntity.ok(cart);
    }

    @PostMapping("/sync")
    public ResponseEntity<?> syncCart(@RequestBody Cart cart, Authentication auth) {
        String userId = getUserId(auth);
        Cart existing = cartRepository.findByUserId(userId).orElse(new Cart());
        existing.setUserId(userId);
        existing.setItems(cart.getItems());
        recalculateTotals(existing);
        return ResponseEntity.ok(cartRepository.save(existing));
    }

    @PostMapping
    public ResponseEntity<?> addToCart(@RequestBody CartItem item, Authentication auth) {
        String userId = getUserId(auth);
        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart newCart = new Cart();
            newCart.setUserId(userId);
            newCart.setItems(new ArrayList<>());
            return newCart;
        });

        boolean found = false;
        if (cart.getItems() == null) cart.setItems(new ArrayList<>());
        for (CartItem existing : cart.getItems()) {
            if (existing.getProductId().equals(item.getProductId()) &&
                java.util.Objects.equals(existing.getSize(), item.getSize()) &&
                java.util.Objects.equals(existing.getColor(), item.getColor())) {
                existing.setQuantity(existing.getQuantity() + item.getQuantity());
                found = true;
                break;
            }
        }
        if (!found) {
            cart.getItems().add(item);
        }

        recalculateTotals(cart);
        return ResponseEntity.ok(cartRepository.save(cart));
    }

    @PutMapping("/{itemId}")
    public ResponseEntity<?> updateCartItem(@PathVariable int itemId, @RequestBody java.util.Map<String, Integer> update, Authentication auth) {
        String userId = getUserId(auth);
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart != null && cart.getItems() != null && itemId >= 0 && itemId < cart.getItems().size()) {
            cart.getItems().get(itemId).setQuantity(update.get("quantity"));
            recalculateTotals(cart);
            return ResponseEntity.ok(cartRepository.save(cart));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable int itemId, Authentication auth) {
        String userId = getUserId(auth);
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart != null && cart.getItems() != null && itemId >= 0 && itemId < cart.getItems().size()) {
            cart.getItems().remove(itemId);
            recalculateTotals(cart);
            return ResponseEntity.ok(cartRepository.save(cart));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping
    public ResponseEntity<?> clearCart(Authentication auth) {
        String userId = getUserId(auth);
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart != null) {
            cart.setItems(new ArrayList<>());
            recalculateTotals(cart);
            return ResponseEntity.ok(cartRepository.save(cart));
        }
        return ResponseEntity.ok().build();
    }

    private void recalculateTotals(Cart cart) {
        if (cart.getItems() == null) return;
        double total = 0;
        double discountedTotal = 0;
        int count = 0;
        for (CartItem item : cart.getItems()) {
            total += item.getPrice() * item.getQuantity();
            discountedTotal += (item.getDiscountedPrice() != null ? item.getDiscountedPrice() : item.getPrice()) * item.getQuantity();
            count += item.getQuantity();
        }
        cart.setTotalPrice(total);
        cart.setTotalDiscountedPrice(discountedTotal);
        cart.setTotalItems(count);
    }
}
