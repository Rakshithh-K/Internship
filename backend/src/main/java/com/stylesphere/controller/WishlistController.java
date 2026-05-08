package com.stylesphere.controller;

import com.stylesphere.model.Wishlist;
import com.stylesphere.repository.WishlistRepository;
import com.stylesphere.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistRepository wishlistRepository;

    private String getUserId(Authentication auth) {
        return ((UserDetailsImpl) auth.getPrincipal()).getId();
    }

    @GetMapping
    public ResponseEntity<Wishlist> getWishlist(Authentication auth) {
        String userId = getUserId(auth);
        Wishlist wishlist = wishlistRepository.findByUserId(userId).orElseGet(() -> {
            Wishlist newWl = new Wishlist();
            newWl.setUserId(userId);
            newWl.setProductIds(new ArrayList<>());
            return wishlistRepository.save(newWl);
        });
        return ResponseEntity.ok(wishlist);
    }

    @PostMapping("/sync")
    public ResponseEntity<?> syncWishlist(@RequestBody List<String> productIds, Authentication auth) {
        String userId = getUserId(auth);
        Wishlist existing = wishlistRepository.findByUserId(userId).orElse(new Wishlist());
        existing.setUserId(userId);
        existing.setProductIds(productIds);
        return ResponseEntity.ok(wishlistRepository.save(existing));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<?> addToWishlist(@PathVariable String productId, Authentication auth) {
        String userId = getUserId(auth);
        Wishlist existing = wishlistRepository.findByUserId(userId).orElseGet(() -> {
            Wishlist newWl = new Wishlist();
            newWl.setUserId(userId);
            newWl.setProductIds(new ArrayList<>());
            return newWl;
        });
        if (existing.getProductIds() == null) existing.setProductIds(new ArrayList<>());
        if (!existing.getProductIds().contains(productId)) {
            existing.getProductIds().add(productId);
        }
        return ResponseEntity.ok(wishlistRepository.save(existing));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<?> removeFromWishlist(@PathVariable String productId, Authentication auth) {
        String userId = getUserId(auth);
        Wishlist existing = wishlistRepository.findByUserId(userId).orElse(null);
        if (existing != null && existing.getProductIds() != null) {
            existing.getProductIds().remove(productId);
            return ResponseEntity.ok(wishlistRepository.save(existing));
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{productId}/move-to-cart")
    public ResponseEntity<?> moveToCart(@PathVariable String productId, Authentication auth) {
        String userId = getUserId(auth);
        Wishlist existing = wishlistRepository.findByUserId(userId).orElse(null);
        if (existing != null && existing.getProductIds() != null) {
            existing.getProductIds().remove(productId);
            wishlistRepository.save(existing);
        }
        // In a real scenario, this would interact with CartService to add the item.
        // The frontend cartApi.addToCart would have to be called separately or CartService wired here.
        return ResponseEntity.ok().build();
    }
}
