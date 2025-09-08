package com.booking.hotel.controller;

import com.booking.hotel.entity.Amenity;
import com.booking.hotel.service.AmenityService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/amenities")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AmenityController {

    private final AmenityService amenityService;

    public AmenityController(AmenityService amenityService) {
        this.amenityService = amenityService;
    }

    /**
     * GET /api/amenities - Get all amenities with pagination, sorting and filtering
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<Page<Amenity>> getAllAmenities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDirection,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "true") boolean activeOnly
    ) {
        try {
            Page<Amenity> amenities = amenityService.getAllAmenities(
                page, size, sortBy, sortDirection, search, activeOnly
            );
            return ResponseEntity.ok(amenities);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/amenities/test - Simple test endpoint
     */
    @GetMapping("/test")
    public ResponseEntity<?> testAmenityController() {
        System.out.println("=== AmenityController - test endpoint called ===");
        return ResponseEntity.ok(java.util.Map.of(
            "message", "Amenity controller is working",
            "timestamp", java.time.Instant.now().toString()
        ));
    }

    /**
     * GET /api/amenities/active - Get all active amenities without pagination
     */
    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<Amenity>> getAllActiveAmenities() {
        try {
            System.out.println("=== AmenityController - getAllActiveAmenities called ===");
            List<Amenity> amenities = amenityService.getAllActiveAmenities();
            System.out.println("Found " + (amenities != null ? amenities.size() : 0) + " active amenities");
            return ResponseEntity.ok(amenities);
        } catch (Exception e) {
            System.out.println("Error in getAllActiveAmenities: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/amenities/{id} - Get amenity by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<Amenity> getAmenityById(@PathVariable Long id) {
        try {
            Optional<Amenity> amenity = amenityService.getAmenityById(id);
            return amenity.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/amenities/name/{name} - Get amenity by name
     */
    @GetMapping("/name/{name}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<Amenity> getAmenityByName(@PathVariable String name) {
        try {
            Optional<Amenity> amenity = amenityService.getAmenityByName(name);
            return amenity.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /api/amenities - Create new amenity
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createAmenity(@Valid @RequestBody Amenity amenity) {
        try {
            Amenity createdAmenity = amenityService.createAmenity(amenity);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdAmenity);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new ErrorResponse("An error occurred while creating the amenity"));
        }
    }

    /**
     * PUT /api/amenities/{id} - Update amenity
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateAmenity(@PathVariable Long id, @Valid @RequestBody Amenity amenity) {
        try {
            Amenity updatedAmenity = amenityService.updateAmenity(id, amenity);
            return ResponseEntity.ok(updatedAmenity);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest()
                                .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new ErrorResponse("An error occurred while updating the amenity"));
        }
    }

    /**
     * DELETE /api/amenities/{id} - Soft delete amenity
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAmenity(@PathVariable Long id) {
        try {
            amenityService.deleteAmenity(id);
            return ResponseEntity.ok(new SuccessResponse("Amenity deactivated successfully"));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest()
                                .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new ErrorResponse("An error occurred while deleting the amenity"));
        }
    }

    /**
     * DELETE /api/amenities/{id}/permanent - Permanently delete amenity
     */
    @DeleteMapping("/{id}/permanent")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> permanentlyDeleteAmenity(@PathVariable Long id) {
        try {
            amenityService.permanentlyDeleteAmenity(id);
            return ResponseEntity.ok(new SuccessResponse("Amenity permanently deleted"));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest()
                                .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new ErrorResponse("An error occurred while permanently deleting the amenity"));
        }
    }

    /**
     * GET /api/amenities/count - Get total active amenity count
     */
    @GetMapping("/count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<AmenityCountResponse> getTotalActiveAmenityCount() {
        try {
            long count = amenityService.getTotalActiveAmenityCount();
            return ResponseEntity.ok(new AmenityCountResponse(count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/amenities/check-name/{name} - Check if amenity name exists
     */
    @GetMapping("/check-name/{name}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AmenityExistsResponse> checkAmenityName(@PathVariable String name) {
        try {
            boolean exists = amenityService.amenityNameExists(name);
            return ResponseEntity.ok(new AmenityExistsResponse(exists));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/amenities/used-by-rooms - Get amenities used by rooms
     */
    @GetMapping("/used-by-rooms")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<List<Amenity>> getAmenitiesUsedByRooms() {
        try {
            List<Amenity> amenities = amenityService.getAmenitiesUsedByRooms();
            return ResponseEntity.ok(amenities);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Response DTOs
    public static class ErrorResponse {
        private String message;

        public ErrorResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public static class SuccessResponse {
        private String message;

        public SuccessResponse(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    public static class AmenityCountResponse {
        private long count;

        public AmenityCountResponse(long count) {
            this.count = count;
        }

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }
    }

    public static class AmenityExistsResponse {
        private boolean exists;

        public AmenityExistsResponse(boolean exists) {
            this.exists = exists;
        }

        public boolean isExists() {
            return exists;
        }

        public void setExists(boolean exists) {
            this.exists = exists;
        }
    }
}