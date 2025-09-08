package com.booking.hotel.service;

import com.booking.hotel.dto.RoomServiceRequestDTO;
import com.booking.hotel.dto.RoomServiceResponseDTO;
import com.booking.hotel.entity.RoomService;
import com.booking.hotel.entity.Booking;
import com.booking.hotel.repository.RoomServiceRepository;
import com.booking.hotel.repository.BookingRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RoomServiceService {
    
    @Autowired
    private RoomServiceRepository roomServiceRepository;
    
    @Autowired
    private BookingRepository bookingRepository;
    
    /**
     * Create a new room service request
     */
    public RoomServiceResponseDTO createRoomService(RoomServiceRequestDTO requestDTO) {
        // Validate service type
        validateServiceType(requestDTO.getServiceType());
        
        // Validate room number - check if room exists in active booking
        Booking booking = validateRoomNumber(requestDTO.getRoomNumber());
        
        RoomService roomService = new RoomService();
        roomService.setRoomNumber(requestDTO.getRoomNumber());
        roomService.setServiceType(requestDTO.getServiceType());
        roomService.setAmount(requestDTO.getAmount());
        roomService.setDescription(requestDTO.getDescription());
        roomService.setStatus(RoomService.ServiceStatus.PENDING);
        
        // Set guest name from booking if available
        if (booking != null) {
            roomService.setGuestName(booking.getFirstName() + " " + booking.getLastName());
        }
        
        RoomService savedRoomService = roomServiceRepository.save(roomService);
        return new RoomServiceResponseDTO(savedRoomService);
    }
    
    /**
     * Get all room service requests
     */
    @Transactional(readOnly = true)
    public List<RoomServiceResponseDTO> getAllRoomServices() {
        List<RoomService> roomServices = roomServiceRepository.findAll();
        return roomServices.stream()
                .map(RoomServiceResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get room service by ID
     */
    @Transactional(readOnly = true)
    public RoomServiceResponseDTO getRoomServiceById(Long id) {
        RoomService roomService = roomServiceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Room service request not found with ID: " + id));
        return new RoomServiceResponseDTO(roomService);
    }
    
    /**
     * Update room service status
     */
    public RoomServiceResponseDTO updateRoomServiceStatus(Long id, String status) {
        RoomService roomService = roomServiceRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Room service request not found with ID: " + id));
        
        try {
            RoomService.ServiceStatus newStatus = RoomService.ServiceStatus.valueOf(status.toUpperCase());
            roomService.setStatus(newStatus);
            
            if (newStatus == RoomService.ServiceStatus.COMPLETED) {
                roomService.setCompletedAt(LocalDateTime.now());
            }
            
            RoomService updatedRoomService = roomServiceRepository.save(roomService);
            return new RoomServiceResponseDTO(updatedRoomService);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status + ". Valid statuses are: PENDING, IN_PROGRESS, COMPLETED, CANCELLED");
        }
    }
    
    /**
     * Delete room service request
     */
    public void deleteRoomService(Long id) {
        if (!roomServiceRepository.existsById(id)) {
            throw new EntityNotFoundException("Room service request not found with ID: " + id);
        }
        roomServiceRepository.deleteById(id);
    }
    
    /**
     * Get room services by room number
     */
    @Transactional(readOnly = true)
    public List<RoomServiceResponseDTO> getRoomServicesByRoomNumber(String roomNumber) {
        List<RoomService> roomServices = roomServiceRepository.findByRoomNumberOrderByRequestedAtDesc(roomNumber);
        return roomServices.stream()
                .map(RoomServiceResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get room services by status
     */
    @Transactional(readOnly = true)
    public List<RoomServiceResponseDTO> getRoomServicesByStatus(String status) {
        try {
            RoomService.ServiceStatus serviceStatus = RoomService.ServiceStatus.valueOf(status.toUpperCase());
            List<RoomService> roomServices = roomServiceRepository.findByStatusOrderByRequestedAtDesc(serviceStatus);
            return roomServices.stream()
                    .map(RoomServiceResponseDTO::new)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status + ". Valid statuses are: PENDING, IN_PROGRESS, COMPLETED, CANCELLED");
        }
    }
    
    /**
     * Get active (pending or in-progress) room services
     */
    @Transactional(readOnly = true)
    public List<RoomServiceResponseDTO> getActiveRoomServices() {
        List<RoomService> roomServices = roomServiceRepository.findActiveServices();
        return roomServices.stream()
                .map(RoomServiceResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Get today's room service requests
     */
    @Transactional(readOnly = true)
    public List<RoomServiceResponseDTO> getTodayRoomServices() {
        List<RoomService> roomServices = roomServiceRepository.findTodayServices();
        return roomServices.stream()
                .map(RoomServiceResponseDTO::new)
                .collect(Collectors.toList());
    }
    
    /**
     * Validate room number by checking if it exists in active bookings
     */
    private Booking validateRoomNumber(String roomNumber) {
        // Find active booking (CHECKED_IN status) for the room number
        List<Booking> activeBookings = bookingRepository.findByRoomNumberAndStatus(roomNumber, Booking.BookingStatus.CHECKED_IN);
        
        if (activeBookings.isEmpty()) {
            throw new IllegalArgumentException("Booking data not found, please retype the room number.");
        }
        
        // Return the first active booking (there should be only one)
        return activeBookings.get(0);
    }
    
    /**
     * Validate service type
     */
    private void validateServiceType(String serviceType) {
        String[] validTypes = {
            "CLEANING", "MAINTENANCE", "FOOD_DELIVERY", "LAUNDRY", 
            "MINI_BAR", "TOWEL_CHANGE", "AMENITIES", "OTHER"
        };
        
        boolean isValid = false;
        for (String validType : validTypes) {
            if (validType.equals(serviceType.toUpperCase())) {
                isValid = true;
                break;
            }
        }
        
        if (!isValid) {
            throw new IllegalArgumentException("Invalid service type: " + serviceType + 
                ". Valid types are: CLEANING, MAINTENANCE, FOOD_DELIVERY, LAUNDRY, MINI_BAR, TOWEL_CHANGE, AMENITIES, OTHER");
        }
    }
}