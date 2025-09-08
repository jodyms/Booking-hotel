package com.booking.hotel.config;

import com.booking.hotel.entity.Amenity;
import com.booking.hotel.model.User;
import com.booking.hotel.repository.AmenityRepository;
import com.booking.hotel.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final AmenityRepository amenityRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(AmenityRepository amenityRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.amenityRepository = amenityRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Load amenities data if the table is empty
        if (amenityRepository.count() == 0) {
            loadAmenities();
        }
        // Create admin user if needed
        createAdminUser();
    }

    private void createAdminUser() {
        // Check if admin user exists
        if (!userRepository.existsByEmail("admin@hotel.com")) {
            User admin = new User();
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setEmail("admin@hotel.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setPhoneNumber("+1234567890");
            admin.setRole(User.Role.ADMIN);
            admin.setIsActive(true);
            
            userRepository.save(admin);
            System.out.println("Admin user created: admin@hotel.com / admin123");
        } else {
            System.out.println("Admin user already exists");
        }
    }

    private void loadAmenities() {
        List<Amenity> amenities = Arrays.asList(
            new Amenity("WiFi", "Free wireless internet access", "wifi"),
            new Amenity("Air Conditioning", "Climate control with air conditioning", "ac"),
            new Amenity("TV", "Flat screen television with cable channels", "tv"),
            new Amenity("Mini Bar", "In-room mini refrigerator with beverages and snacks", "minibar"),
            new Amenity("Room Service", "24-hour room service available", "room-service"),
            new Amenity("Safe", "In-room safety deposit box", "safe"),
            new Amenity("Balcony", "Private balcony with outdoor seating", "balcony"),
            new Amenity("Ocean View", "Room with ocean view", "ocean-view"),
            new Amenity("City View", "Room with city skyline view", "city-view"),
            new Amenity("Hot Tub", "Private hot tub or jacuzzi", "hot-tub"),
            new Amenity("Fireplace", "In-room fireplace", "fireplace"),
            new Amenity("Kitchen", "Full kitchen with cooking facilities", "kitchen"),
            new Amenity("Kitchenette", "Small kitchen area with basic cooking facilities", "kitchenette"),
            new Amenity("Washing Machine", "In-room washing machine", "washing-machine"),
            new Amenity("Parking", "Dedicated parking space", "parking"),
            new Amenity("Pet Friendly", "Pets allowed in room", "pet-friendly"),
            new Amenity("Smoking Allowed", "Smoking permitted in room", "smoking"),
            new Amenity("Non-Smoking", "Non-smoking room", "no-smoking"),
            new Amenity("Desk", "Work desk with chair", "desk"),
            new Amenity("Sofa", "Comfortable seating area with sofa", "sofa"),
            new Amenity("Coffee Maker", "In-room coffee making facilities", "coffee"),
            new Amenity("Hair Dryer", "Hair dryer available in bathroom", "hair-dryer"),
            new Amenity("Iron & Ironing Board", "Iron and ironing board provided", "iron"),
            new Amenity("Bathtub", "Full bathtub in bathroom", "bathtub"),
            new Amenity("Shower", "Separate shower in bathroom", "shower"),
            new Amenity("Towels", "Fresh towels provided", "towels"),
            new Amenity("Toiletries", "Complimentary toiletries", "toiletries"),
            new Amenity("Gym Access", "Access to hotel gym facilities", "gym"),
            new Amenity("Pool Access", "Access to hotel swimming pool", "pool"),
            new Amenity("Spa Access", "Access to hotel spa services", "spa")
        );

        amenityRepository.saveAll(amenities);
        System.out.println("Loaded " + amenities.size() + " amenities into database");
    }
}