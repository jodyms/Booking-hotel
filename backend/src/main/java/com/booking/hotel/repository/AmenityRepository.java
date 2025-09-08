package com.booking.hotel.repository;

import com.booking.hotel.entity.Amenity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AmenityRepository extends JpaRepository<Amenity, Long> {

    /**
     * Find amenity by name
     */
    Optional<Amenity> findByName(String name);

    /**
     * Check if amenity name exists
     */
    boolean existsByName(String name);

    /**
     * Find all active amenities
     */
    List<Amenity> findByIsActiveTrue();

    /**
     * Find active amenities with pagination
     */
    Page<Amenity> findByIsActiveTrue(Pageable pageable);

    /**
     * Find amenities by name containing (case insensitive)
     */
    @Query("SELECT a FROM Amenity a WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           " LOWER(a.name) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:activeOnly = false OR a.isActive = true)")
    Page<Amenity> findAmenitiesWithFilters(
        @Param("search") String search,
        @Param("activeOnly") boolean activeOnly,
        Pageable pageable
    );

    /**
     * Find amenities by IDs
     */
    List<Amenity> findByIdIn(List<Long> ids);

    /**
     * Find active amenities by IDs
     */
    List<Amenity> findByIdInAndIsActiveTrue(List<Long> ids);

    /**
     * Count active amenities
     */
    @Query("SELECT COUNT(a) FROM Amenity a WHERE a.isActive = true")
    long countActiveAmenities();

    /**
     * Find amenities used by rooms
     */
    @Query("SELECT DISTINCT a FROM Amenity a " +
           "JOIN a.rooms r " +
           "WHERE a.isActive = true")
    List<Amenity> findAmenitiesUsedByRooms();
}