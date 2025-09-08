package com.booking.hotel.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "http://localhost:5173")
public class PublicController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Hotel Booking API");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/oauth-config")
    public ResponseEntity<Map<String, String>> getOAuthConfig() {
        Map<String, String> config = new HashMap<>();
        config.put("issuerUrl", "http://localhost:8080/realms/hotel-booking");
        config.put("clientId", "hotel-booking-client");
        config.put("redirectUri", "http://localhost:5173/callback");
        return ResponseEntity.ok(config);
    }
}