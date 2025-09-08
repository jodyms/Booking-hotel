package com.booking.hotel.controller;

import com.booking.hotel.entity.Room;
import com.booking.hotel.entity.Room.RoomType;
import com.booking.hotel.entity.Booking;
import com.booking.hotel.repository.RoomRepository;
import com.booking.hotel.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/seed")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SeedController {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping("/load-data")
    public ResponseEntity<?> loadSeedData() {
        try {
            // Create rooms first
            createRooms();
            
            // Create bookings with sample data
            createBookings();
            
            return ResponseEntity.ok("Seeder data loaded successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error loading seed data: " + e.getMessage());
        }
    }

    private void createRooms() {
        List<Room> rooms = new ArrayList<>();
        
        // Standard rooms
        rooms.add(new Room("101", RoomType.STANDARD, new BigDecimal("150.00"), 2, 1, "Comfortable standard room with city view", true));
        rooms.add(new Room("102", RoomType.STANDARD, new BigDecimal("150.00"), 2, 1, "Cozy standard room with modern amenities", true));
        rooms.add(new Room("203", RoomType.STANDARD, new BigDecimal("150.00"), 2, 1, "Standard room with garden view", true));
        rooms.add(new Room("302", RoomType.STANDARD, new BigDecimal("150.00"), 2, 1, "Standard room near elevator", true));
        
        // Deluxe rooms
        rooms.add(new Room("103", RoomType.DELUXE, new BigDecimal("250.00"), 2, 2, "Spacious deluxe room with balcony", true));
        rooms.add(new Room("104", RoomType.DELUXE, new BigDecimal("250.00"), 2, 2, "Elegant deluxe room with premium furnishing", true));
        rooms.add(new Room("204", RoomType.DELUXE, new BigDecimal("250.00"), 2, 2, "Deluxe room with kitchenette", true));
        
        // Suite rooms
        rooms.add(new Room("201", RoomType.SUITE, new BigDecimal("450.00"), 4, 2, "Luxury suite with separate living area", true));
        rooms.add(new Room("202", RoomType.SUITE, new BigDecimal("450.00"), 4, 2, "Presidential suite with ocean view", true));
        rooms.add(new Room("301", RoomType.SUITE, new BigDecimal("450.00"), 4, 2, "Penthouse suite with panoramic views", true));

        for (Room room : rooms) {
            if (!roomRepository.existsByRoomNumber(room.getRoomNumber())) {
                roomRepository.save(room);
            }
        }
    }

    private void createBookings() {
        List<Room> rooms = roomRepository.findAll();
        if (rooms.isEmpty()) return;

        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);

        List<Booking> bookings = new ArrayList<>();

        // Today's check-ins (BOOKED status)
        bookings.add(new Booking("John", "Smith", "he/him", today, today.plusDays(3), 2, 0, rooms.get(0), new BigDecimal("450.00")));
        bookings.add(new Booking("Sarah", "Johnson", "she/her", today, today.plusDays(2), 2, 1, rooms.get(2), new BigDecimal("500.00")));
        
        // Today's check-outs (CHECKED_IN status)
        bookings.add(new Booking("Lisa", "Anderson", "she/her", today.minusDays(2), today, 2, 1, rooms.get(1), new BigDecimal("300.00")));
        bookings.get(bookings.size() - 1).setStatus(Booking.BookingStatus.CHECKED_IN);
        
        // Weekly data for occupancy chart
        for (int i = 0; i < 7; i++) {
            LocalDate bookingDate = startOfWeek.plusDays(i);
            
            // Add some bookings for each day
            if (i < rooms.size()) {
                Room room = rooms.get(i % rooms.size());
                Booking booking = new Booking(
                    "Guest" + i, 
                    "User" + i, 
                    i % 2 == 0 ? "he/him" : "she/her",
                    bookingDate,
                    bookingDate.plusDays(2),
                    2,
                    i % 2,
                    room,
                    room.getPrice().multiply(BigDecimal.valueOf(2))
                );
                
                // Set different statuses for variety
                if (i % 3 == 0) {
                    booking.setStatus(Booking.BookingStatus.BOOKED);
                } else if (i % 3 == 1) {
                    booking.setStatus(Booking.BookingStatus.CHECKED_IN);
                } else {
                    booking.setStatus(Booking.BookingStatus.CHECKED_OUT);
                }
                
                bookings.add(booking);
            }
        }

        // Save all bookings
        for (Booking booking : bookings) {
            if (!bookingRepository.existsByFirstNameAndLastNameAndCheckInDate(
                booking.getFirstName(), booking.getLastName(), booking.getCheckInDate())) {
                bookingRepository.save(booking);
            }
        }
    }
}