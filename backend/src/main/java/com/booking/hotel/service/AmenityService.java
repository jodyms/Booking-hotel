package com.booking.hotel.service;

import com.booking.hotel.entity.Amenity;
import com.booking.hotel.repository.AmenityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AmenityService {

    private final AmenityRepository amenityRepository;

    public AmenityService(AmenityRepository amenityRepository) {
        this.amenityRepository = amenityRepository;
    }

    /**
     * Get all amenities with pagination, sorting, and filtering
     */
    public Page<Amenity> getAllAmenities(int page, int size, String sortBy, String sortDirection,
                                       String search, boolean activeOnly) {
        
        // Create sort object
        Sort.Direction direction = sortDirection.equalsIgnoreCase("desc") ? 
            Sort.Direction.DESC : Sort.Direction.ASC;
        
        // Default sort field validation
        String validatedSortBy = validateSortField(sortBy);
        Sort sort = Sort.by(direction, validatedSortBy);
        
        // Create pageable object
        Pageable pageable = PageRequest.of(page, size, sort);
        
        // Use custom query with filters
        return amenityRepository.findAmenitiesWithFilters(search, activeOnly, pageable);
    }

    /**
     * Get all active amenities without pagination
     */
    @Transactional(readOnly = true)
    public List<Amenity> getAllActiveAmenities() {
        return amenityRepository.findByIsActiveTrue();
    }

    /**
     * Get amenity by ID
     */
    @Transactional(readOnly = true)
    public Optional<Amenity> getAmenityById(Long id) {
        return amenityRepository.findById(id);
    }

    /**
     * Get amenity by name
     */
    @Transactional(readOnly = true)
    public Optional<Amenity> getAmenityByName(String name) {
        return amenityRepository.findByName(name);
    }

    /**
     * Get amenities by IDs
     */
    @Transactional(readOnly = true)
    public List<Amenity> getAmenitiesByIds(List<Long> ids) {
        return amenityRepository.findByIdIn(ids);
    }

    /**
     * Get active amenities by IDs
     */
    @Transactional(readOnly = true)
    public List<Amenity> getActiveAmenitiesByIds(List<Long> ids) {
        return amenityRepository.findByIdInAndIsActiveTrue(ids);
    }

    /**
     * Create a new amenity
     */
    public Amenity createAmenity(Amenity amenity) {
        // Check if amenity name already exists
        if (amenityRepository.existsByName(amenity.getName())) {
            throw new RuntimeException("Amenity name " + amenity.getName() + " already exists");
        }
        
        return amenityRepository.save(amenity);
    }

    /**
     * Update an existing amenity
     */
    public Amenity updateAmenity(Long id, Amenity updatedAmenity) {
        Optional<Amenity> existingAmenityOpt = amenityRepository.findById(id);
        
        if (existingAmenityOpt.isEmpty()) {
            throw new RuntimeException("Amenity not found with ID: " + id);
        }
        
        Amenity existingAmenity = existingAmenityOpt.get();
        
        // Check if amenity name is being changed and if new name already exists
        if (!existingAmenity.getName().equals(updatedAmenity.getName()) &&
            amenityRepository.existsByName(updatedAmenity.getName())) {
            throw new RuntimeException("Amenity name " + updatedAmenity.getName() + " already exists");
        }
        
        // Update fields
        existingAmenity.setName(updatedAmenity.getName());
        existingAmenity.setDescription(updatedAmenity.getDescription());
        existingAmenity.setIcon(updatedAmenity.getIcon());
        existingAmenity.setIsActive(updatedAmenity.getIsActive());
        
        return amenityRepository.save(existingAmenity);
    }

    /**
     * Delete an amenity (soft delete by setting isActive = false)
     */
    public void deleteAmenity(Long id) {
        Optional<Amenity> amenityOpt = amenityRepository.findById(id);
        
        if (amenityOpt.isEmpty()) {
            throw new RuntimeException("Amenity not found with ID: " + id);
        }
        
        Amenity amenity = amenityOpt.get();
        amenity.setIsActive(false);
        amenityRepository.save(amenity);
    }

    /**
     * Permanently delete an amenity
     */
    public void permanentlyDeleteAmenity(Long id) {
        if (!amenityRepository.existsById(id)) {
            throw new RuntimeException("Amenity not found with ID: " + id);
        }
        
        amenityRepository.deleteById(id);
    }

    /**
     * Count total number of active amenities
     */
    @Transactional(readOnly = true)
    public long getTotalActiveAmenityCount() {
        return amenityRepository.countActiveAmenities();
    }

    /**
     * Check if amenity name exists
     */
    @Transactional(readOnly = true)
    public boolean amenityNameExists(String name) {
        return amenityRepository.existsByName(name);
    }

    /**
     * Get amenities used by rooms
     */
    @Transactional(readOnly = true)
    public List<Amenity> getAmenitiesUsedByRooms() {
        return amenityRepository.findAmenitiesUsedByRooms();
    }

    /**
     * Validate sort field to prevent SQL injection and invalid field names
     */
    private String validateSortField(String sortBy) {
        if (sortBy == null || sortBy.trim().isEmpty()) {
            return "name"; // default sort field
        }
        
        // List of allowed sort fields
        List<String> allowedFields = List.of(
            "id", "name", "description", "icon", "isActive", 
            "createdAt", "updatedAt"
        );
        
        if (allowedFields.contains(sortBy)) {
            return sortBy;
        }
        
        return "name"; // default fallback
    }
}