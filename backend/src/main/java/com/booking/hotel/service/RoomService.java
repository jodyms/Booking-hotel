package com.booking.hotel.service;

import com.booking.hotel.dto.RoomRequestDTO;
import com.booking.hotel.dto.RoomResponseDTO;
import com.booking.hotel.entity.Amenity;
import com.booking.hotel.entity.Room;
import com.booking.hotel.mapper.RoomMapper;
import com.booking.hotel.repository.AmenityRepository;
import com.booking.hotel.repository.RoomRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class RoomService {

    private final RoomRepository roomRepository;
    private final AmenityRepository amenityRepository;
    private final RoomMapper roomMapper;

    public RoomService(RoomRepository roomRepository, AmenityRepository amenityRepository, RoomMapper roomMapper) {
        this.roomRepository = roomRepository;
        this.amenityRepository = amenityRepository;
        this.roomMapper = roomMapper;
    }

    /**
     * Get all rooms with pagination, sorting, and filtering
     */
    public Page<Room> getAllRooms(int page, int size, String sortBy, String sortDirection,
                                  String search, BigDecimal minPrice, BigDecimal maxPrice,
                                  Integer adultCapacity, Integer childrenCapacity) {
        
        // Create sort object
        Sort.Direction direction = sortDirection.equalsIgnoreCase("desc") ? 
            Sort.Direction.DESC : Sort.Direction.ASC;
        
        // Default sort field validation
        String validatedSortBy = validateSortField(sortBy);
        Sort sort = Sort.by(direction, validatedSortBy);
        
        // Create pageable object
        Pageable pageable = PageRequest.of(page, size, sort);
        
        // Use custom query with filters
        return roomRepository.findRoomsWithFilters(
            search, minPrice, maxPrice, adultCapacity, childrenCapacity, pageable
        );
    }

    /**
     * Get room by ID
     */
    @Transactional(readOnly = true)
    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    /**
     * Get room by room number
     */
    @Transactional(readOnly = true)
    public Optional<Room> getRoomByRoomNumber(String roomNumber) {
        return roomRepository.findByRoomNumber(roomNumber);
    }

    /**
     * Create a new room
     */
    public Room createRoom(Room room) {
        // Check if room number already exists
        if (roomRepository.existsByRoomNumber(room.getRoomNumber())) {
            throw new RuntimeException("Room number " + room.getRoomNumber() + " already exists");
        }
        
        return roomRepository.save(room);
    }

    /**
     * Create a new room with amenities using DTO
     */
    public RoomResponseDTO createRoomWithAmenities(RoomRequestDTO roomRequestDTO) {
        // Check if room number already exists
        if (roomRepository.existsByRoomNumber(roomRequestDTO.getRoomNumber())) {
            throw new RuntimeException("Room number " + roomRequestDTO.getRoomNumber() + " already exists");
        }

        // Convert DTO to entity
        Room room = roomMapper.toEntity(roomRequestDTO);

        // Add amenities if provided
        if (roomRequestDTO.getAmenityIds() != null && !roomRequestDTO.getAmenityIds().isEmpty()) {
            List<Amenity> amenities = amenityRepository.findByIdInAndIsActiveTrue(roomRequestDTO.getAmenityIds());
            
            // Validate that all requested amenities exist and are active
            if (amenities.size() != roomRequestDTO.getAmenityIds().size()) {
                throw new RuntimeException("Some amenities not found or inactive");
            }

            Set<Amenity> amenitySet = new HashSet<>(amenities);
            room.setAmenities(amenitySet);
        }

        // Save room
        Room savedRoom = roomRepository.save(room);

        // Convert to response DTO
        return roomMapper.toResponseDTO(savedRoom);
    }

    /**
     * Update an existing room
     */
    public Room updateRoom(Long id, Room updatedRoom) {
        Optional<Room> existingRoomOpt = roomRepository.findById(id);
        
        if (existingRoomOpt.isEmpty()) {
            throw new RuntimeException("Room not found with ID: " + id);
        }
        
        Room existingRoom = existingRoomOpt.get();
        
        // Check if room number is being changed and if new number already exists
        if (!existingRoom.getRoomNumber().equals(updatedRoom.getRoomNumber()) &&
            roomRepository.existsByRoomNumber(updatedRoom.getRoomNumber())) {
            throw new RuntimeException("Room number " + updatedRoom.getRoomNumber() + " already exists");
        }
        
        // Update fields
        existingRoom.setRoomNumber(updatedRoom.getRoomNumber());
        existingRoom.setAdultCapacity(updatedRoom.getAdultCapacity());
        existingRoom.setChildrenCapacity(updatedRoom.getChildrenCapacity());
        existingRoom.setPrice(updatedRoom.getPrice());
        
        // Update amenities if provided
        if (updatedRoom.getAmenities() != null) {
            existingRoom.setAmenities(updatedRoom.getAmenities());
        }
        
        return roomRepository.save(existingRoom);
    }

    /**
     * Delete a room
     */
    public void deleteRoom(Long id) {
        if (!roomRepository.existsById(id)) {
            throw new RuntimeException("Room not found with ID: " + id);
        }
        
        roomRepository.deleteById(id);
    }

    /**
     * Get all rooms without pagination
     */
    @Transactional(readOnly = true)
    public List<Room> getAllRoomsAsList() {
        return roomRepository.findAll();
    }

    /**
     * Count total number of rooms
     */
    @Transactional(readOnly = true)
    public long getTotalRoomCount() {
        return roomRepository.count();
    }

    /**
     * Check if room number exists
     */
    @Transactional(readOnly = true)
    public boolean roomNumberExists(String roomNumber) {
        return roomRepository.existsByRoomNumber(roomNumber);
    }

    /**
     * Get available rooms (placeholder for future booking integration)
     */
    @Transactional(readOnly = true)
    public Page<Room> getAvailableRooms(int page, int size, String sortBy, String sortDirection) {
        Sort.Direction direction = sortDirection.equalsIgnoreCase("desc") ? 
            Sort.Direction.DESC : Sort.Direction.ASC;
        
        String validatedSortBy = validateSortField(sortBy);
        Sort sort = Sort.by(direction, validatedSortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        
        return roomRepository.findAvailableRooms(pageable);
    }

    /**
     * Validate sort field to prevent SQL injection and invalid field names
     */
    private String validateSortField(String sortBy) {
        if (sortBy == null || sortBy.trim().isEmpty()) {
            return "roomNumber"; // default sort field
        }
        
        // List of allowed sort fields
        List<String> allowedFields = List.of(
            "id", "roomNumber", "adultCapacity", "childrenCapacity", 
            "price", "createdAt", "updatedAt"
        );
        
        if (allowedFields.contains(sortBy)) {
            return sortBy;
        }
        
        return "roomNumber"; // default fallback
    }
}