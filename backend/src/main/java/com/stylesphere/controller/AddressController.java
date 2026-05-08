package com.stylesphere.controller;

import com.stylesphere.model.Address;
import com.stylesphere.repository.AddressRepository;
import com.stylesphere.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private AddressRepository addressRepository;

    private String getUserId(Authentication auth) {
        return ((UserDetailsImpl) auth.getPrincipal()).getId();
    }

    @GetMapping
    public ResponseEntity<List<Address>> getAddresses(Authentication auth) {
        return ResponseEntity.ok(addressRepository.findByUserId(getUserId(auth)));
    }

    @PostMapping
    public ResponseEntity<Address> addAddress(@RequestBody Address address, Authentication auth) {
        address.setUserId(getUserId(auth));
        if (address.getIsDefault() == null) address.setIsDefault(false);
        
        if (address.getIsDefault()) {
            List<Address> existing = addressRepository.findByUserId(getUserId(auth));
            for (Address a : existing) {
                if (a.getIsDefault()) {
                    a.setIsDefault(false);
                    addressRepository.save(a);
                }
            }
        }
        
        return ResponseEntity.ok(addressRepository.save(address));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable String id) {
        addressRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
