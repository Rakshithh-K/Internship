package com.stylesphere.controller;

import com.stylesphere.dto.request.LoginRequest;
import com.stylesphere.dto.request.SignupRequest;
import com.stylesphere.dto.response.JwtResponse;
import com.stylesphere.dto.response.MessageResponse;
import com.stylesphere.model.User;
import com.stylesphere.repository.UserRepository;
import com.stylesphere.security.JwtUtils;
import com.stylesphere.security.UserDetailsImpl;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Locale;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        String email = loginRequest.getEmail().trim().toLowerCase(Locale.ROOT);
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        return ResponseEntity.ok(buildJwtResponse(authentication));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        String email = signUpRequest.getEmail().trim().toLowerCase(Locale.ROOT);

        if (userRepository.existsByEmail(email)) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Error: Email is already in use!"));
        }

        User user = User.builder()
                .firstName(signUpRequest.getFirstName().trim())
                .lastName(signUpRequest.getLastName().trim())
                .email(email)
                .phone(signUpRequest.getPhone().trim())
                .password(encoder.encode(signUpRequest.getPassword()))
                .role("USER")
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, signUpRequest.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return ResponseEntity.ok(buildJwtResponse(authentication));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new MessageResponse("Unauthorized"));
        }
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.status(404).body(new MessageResponse("User not found"));
        }
        user.setPassword(null); // Don't expose password
        return ResponseEntity.ok(user);
    }

    private JwtResponse buildJwtResponse(Authentication authentication) {
        String jwt = jwtUtils.generateJwtToken(authentication);
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElse(null);

        return new JwtResponse(jwt,
                userDetails.getId(),
                userDetails.getEmail(),
                user != null ? user.getFirstName() : "",
                user != null ? user.getLastName() : "",
                user != null ? user.getRole() : "USER");
    }
}
