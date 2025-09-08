package com.booking.hotel.controller;

import com.booking.hotel.dto.RoomServiceRequestDTO;
import com.booking.hotel.dto.RoomServiceResponseDTO;
import com.booking.hotel.service.RoomServiceService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/room-services")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@Validated
public class RoomServiceController {
    
    @Autowired
    private RoomServiceService roomServiceService;
    
    /**
     * Create a new room service request
     * POST /api/room-services
     */
    @PostMapping
    public ResponseEntity<?> createRoomService(@Valid @RequestBody RoomServiceRequestDTO requestDTO) {
        try {
            RoomServiceResponseDTO response = roomServiceService.createRoomService(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("status", "BAD_REQUEST");
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to create room service request: " + e.getMessage());
            error.put("status", "INTERNAL_SERVER_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * Get all room service requests
     * GET /api/room-services
     */
    @GetMapping
    public ResponseEntity<List<RoomServiceResponseDTO>> getAllRoomServices() {
        try {
            List<RoomServiceResponseDTO> roomServices = roomServiceService.getAllRoomServices();
            return ResponseEntity.ok(roomServices);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get room service by ID
     * GET /api/room-services/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getRoomServiceById(@PathVariable Long id) {
        try {
            RoomServiceResponseDTO roomService = roomServiceService.getRoomServiceById(id);
            return ResponseEntity.ok(roomService);
        } catch (EntityNotFoundException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("status", "NOT_FOUND");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to fetch room service: " + e.getMessage());
            error.put("status", "INTERNAL_SERVER_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * Update room service status
     * PUT /api/room-services/{id}/status?status={status}
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateRoomServiceStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            RoomServiceResponseDTO roomService = roomServiceService.updateRoomServiceStatus(id, status);
            return ResponseEntity.ok(roomService);
        } catch (EntityNotFoundException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("status", "NOT_FOUND");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("status", "BAD_REQUEST");
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update room service status: " + e.getMessage());
            error.put("status", "INTERNAL_SERVER_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * Delete room service request
     * DELETE /api/room-services/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoomService(@PathVariable Long id) {
        try {
            roomServiceService.deleteRoomService(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Room service request deleted successfully");
            response.put("status", "OK");
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("status", "NOT_FOUND");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to delete room service: " + e.getMessage());
            error.put("status", "INTERNAL_SERVER_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * Get room services by room number
     * GET /api/room-services/room/{roomNumber}
     */
    @GetMapping("/room/{roomNumber}")
    public ResponseEntity<List<RoomServiceResponseDTO>> getRoomServicesByRoom(@PathVariable String roomNumber) {
        try {
            List<RoomServiceResponseDTO> roomServices = roomServiceService.getRoomServicesByRoomNumber(roomNumber);
            return ResponseEntity.ok(roomServices);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get room services by status
     * GET /api/room-services/status/{status}
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getRoomServicesByStatus(@PathVariable String status) {
        try {
            List<RoomServiceResponseDTO> roomServices = roomServiceService.getRoomServicesByStatus(status);
            return ResponseEntity.ok(roomServices);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            error.put("status", "BAD_REQUEST");
            return ResponseEntity.badRequest().body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to fetch room services by status: " + e.getMessage());
            error.put("status", "INTERNAL_SERVER_ERROR");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
    
    /**
     * Get active room services (pending or in-progress)
     * GET /api/room-services/active
     */
    @GetMapping("/active")
    public ResponseEntity<List<RoomServiceResponseDTO>> getActiveRoomServices() {
        try {
            List<RoomServiceResponseDTO> roomServices = roomServiceService.getActiveRoomServices();
            return ResponseEntity.ok(roomServices);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Get today's room service requests
     * GET /api/room-services/today
     */
    @GetMapping("/today")
    public ResponseEntity<List<RoomServiceResponseDTO>> getTodayRoomServices() {
        try {
            List<RoomServiceResponseDTO> roomServices = roomServiceService.getTodayRoomServices();
            return ResponseEntity.ok(roomServices);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    /**
     * Health check endpoint
     * GET /api/room-services/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> healthCheck() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Room Service API");
        response.put("timestamp", java.time.LocalDateTime.now().toString());
        return ResponseEntity.ok(response);
    }
}