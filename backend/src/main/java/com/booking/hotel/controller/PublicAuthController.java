package com.booking.hotel.controller;

import com.booking.hotel.dto.LoginRequest;
import com.booking.hotel.model.User;
import com.booking.hotel.service.UserService;
import com.booking.hotel.service.JWTTokenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
public class PublicAuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JWTTokenService jwtTokenService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("=== PublicAuthController - Login Request Received ===");
            System.out.println("Request email: " + loginRequest.getEmail());
            System.out.println("Request username: " + loginRequest.getUsername());
            System.out.println("Login identifier: " + loginRequest.getLoginIdentifier());
            
            String loginIdentifier = loginRequest.getLoginIdentifier();
            System.out.println("Attempting to authenticate user: " + loginIdentifier);
            
            User user = userService.authenticateUser(loginIdentifier, loginRequest.getPassword());
            System.out.println("User authenticated successfully: " + user.getEmail());
            
            String accessToken = jwtTokenService.generateToken(user.getEmail(), user.getRole().toString());
            String refreshToken = jwtTokenService.generateRefreshToken(user.getEmail());
            
            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("token", accessToken);
            responseBody.put("refreshToken", refreshToken);
            responseBody.put("email", user.getEmail());
            responseBody.put("firstName", user.getFirstName());
            responseBody.put("lastName", user.getLastName());
            responseBody.put("role", user.getRole().toString());
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            System.out.println("PublicAuthController - Login successful for: " + user.getEmail());
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(responseBody);
        } catch (RuntimeException e) {
            System.out.println("PublicAuthController - Login failed: " + e.getMessage());
            
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid username/email or password");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> test() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Public auth controller is working");
        response.put("timestamp", java.time.Instant.now().toString());
        
        return ResponseEntity.ok().body(response);
    }

    @RequestMapping(method = RequestMethod.OPTIONS, value = "/**")
    public ResponseEntity<?> handleOptionsRequests() {
        return ResponseEntity.ok().build();
    }
}