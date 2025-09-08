package com.booking.hotel.controller;

import com.booking.hotel.dto.LoginRequest;
import com.booking.hotel.dto.SignupRequest;
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
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JWTTokenService jwtTokenService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("=== AuthController - Login Request Received ===");
            System.out.println("Request email: " + loginRequest.getEmail());
            System.out.println("Request username: " + loginRequest.getUsername());
            System.out.println("Login identifier: " + loginRequest.getLoginIdentifier());
            
            String loginIdentifier = loginRequest.getLoginIdentifier();
            User user = userService.authenticateUser(loginIdentifier, loginRequest.getPassword());
            
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
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(responseBody);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid username/email or password");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        try {
            String refreshToken = request.get("refresh_token");
            
            if (refreshToken == null || !jwtTokenService.isTokenValid(refreshToken)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Invalid refresh token");
                return ResponseEntity.badRequest().body(error);
            }
            
            String email = jwtTokenService.extractEmail(refreshToken);
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String newAccessToken = jwtTokenService.generateToken(user.getEmail(), user.getRole().toString());
            String newRefreshToken = jwtTokenService.generateRefreshToken(user.getEmail());
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", newAccessToken);
            response.put("refreshToken", newRefreshToken);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Token refresh failed");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest signupRequest) {
        try {
            if (userService.emailExists(signupRequest.getEmail())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Email already exists");
                return ResponseEntity.badRequest().body(error);
            }

            User user = new User();
            user.setFirstName(signupRequest.getFirstName());
            user.setLastName(signupRequest.getLastName());
            user.setEmail(signupRequest.getEmail());
            user.setPassword(signupRequest.getPassword());
            user.setPhoneNumber(signupRequest.getPhoneNumber());

            User savedUser = userService.registerUser(user);
            
            String accessToken = jwtTokenService.generateToken(savedUser.getEmail(), savedUser.getRole().toString());
            String refreshToken = jwtTokenService.generateRefreshToken(savedUser.getEmail());

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("token", accessToken);
            responseBody.put("refreshToken", refreshToken);
            responseBody.put("email", savedUser.getEmail());
            responseBody.put("firstName", savedUser.getFirstName());
            responseBody.put("lastName", savedUser.getLastName());
            responseBody.put("role", savedUser.getRole().toString());

            return ResponseEntity.ok(responseBody);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestBody Map<String, String> request) {
        try {
            String token = request.get("token");
            
            if (token == null || !jwtTokenService.isTokenValid(token)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Invalid token");
                return ResponseEntity.badRequest().body(error);
            }
            
            String email = jwtTokenService.extractEmail(token);
            String role = jwtTokenService.extractRole(token);
            
            Map<String, Object> response = new HashMap<>();
            response.put("valid", true);
            response.put("email", email);
            response.put("role", role);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Token validation failed");
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Auth controller is working");
        response.put("timestamp", java.time.Instant.now().toString());
        return ResponseEntity.ok(response);
    }

    @RequestMapping(method = RequestMethod.OPTIONS, value = "/**")
    public ResponseEntity<?> handleOptionsRequests() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Access-Control-Allow-Origin", "http://localhost:5173");
        headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        headers.set("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept");
        headers.set("Access-Control-Allow-Credentials", "true");
        headers.set("Access-Control-Max-Age", "3600");
        
        return ResponseEntity.ok().headers(headers).build();
    }
}