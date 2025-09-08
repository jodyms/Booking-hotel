package com.booking.hotel.service;

import com.booking.hotel.model.User;
import com.booking.hotel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        // Encode password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmailAndIsActive(email, true);
    }

    public boolean validatePassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public User authenticateUser(String email, String password) {
        Optional<User> userOptional = findByEmail(email);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (validatePassword(password, user.getPassword())) {
                return user;
            }
        }
        
        throw new RuntimeException("Invalid email or password");
    }

    public User saveOAuthUser(String email, String firstName, String lastName) {
        Optional<User> existingUser = userRepository.findByEmail(email);
        
        if (existingUser.isPresent()) {
            // Update existing user info from OAuth
            User user = existingUser.get();
            user.setFirstName(firstName);
            user.setLastName(lastName);
            user.setIsActive(true);
            return userRepository.save(user);
        } else {
            // Create new user from OAuth
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFirstName(firstName);
            newUser.setLastName(lastName);
            newUser.setPassword(""); // OAuth users don't have local passwords
            newUser.setIsActive(true);
            return userRepository.save(newUser);
        }
    }

    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public User findByEmailOrCreate(String email) {
        Optional<User> existingUser = findByEmail(email);
        
        if (existingUser.isPresent()) {
            return existingUser.get();
        } else {
            // Create new user for OAuth authentication
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFirstName("");
            newUser.setLastName("");
            newUser.setPassword(""); // OAuth users don't have local passwords
            newUser.setIsActive(true);
            return userRepository.save(newUser);
        }
    }
}