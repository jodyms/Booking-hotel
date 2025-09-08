package com.booking.hotel.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "Username or email is required")
    private String email; // Can be username or email

    @NotBlank(message = "Password is required")
    private String password;

    // For backward compatibility, also support username field
    private String username;

    // Constructors
    public LoginRequest() {}

    public LoginRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    // Helper method to get login identifier (email or username)
    public String getLoginIdentifier() {
        if (username != null && !username.trim().isEmpty()) {
            return username.trim();
        }
        return email != null ? email.trim() : "";
    }
}