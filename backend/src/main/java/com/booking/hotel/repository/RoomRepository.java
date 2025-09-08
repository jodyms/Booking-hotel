package com.booking.hotel.repository;

import com.booking.hotel.entity.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    /**
     * Find room by room number
     */
    Optional<Room> findByRoomNumber(String roomNumber);

    /**
     * Check if room number exists
     */
    boolean existsByRoomNumber(String roomNumber);

    /**
     * Find rooms with filters and pagination
     */
    @Query("SELECT r FROM Room r WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           " LOWER(r.roomNumber) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:minPrice IS NULL OR r.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR r.price <= :maxPrice) AND " +
           "(:adultCapacity IS NULL OR r.adultCapacity >= :adultCapacity) AND " +
           "(:childrenCapacity IS NULL OR r.childrenCapacity >= :childrenCapacity)")
    Page<Room> findRoomsWithFilters(
        @Param("search") String search,
        @Param("minPrice") BigDecimal minPrice,
        @Param("maxPrice") BigDecimal maxPrice,
        @Param("adultCapacity") Integer adultCapacity,
        @Param("childrenCapacity") Integer childrenCapacity,
        Pageable pageable
    );

    /**
     * Find rooms by adult capacity
     */
    Page<Room> findByAdultCapacityGreaterThanEqual(Integer adultCapacity, Pageable pageable);

    /**
     * Find rooms by children capacity
     */
    Page<Room> findByChildrenCapacityGreaterThanEqual(Integer childrenCapacity, Pageable pageable);

    /**
     * Find rooms by price range
     */
    Page<Room> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);

    /**
     * Count total rooms
     */
    @Query("SELECT COUNT(r) FROM Room r")
    long countAllRooms();

    /**
     * Find available rooms (rooms not booked for specific dates - to be implemented with booking system)
     * For now, we'll return all rooms
     */
    @Query("SELECT r FROM Room r")
    Page<Room> findAvailableRooms(Pageable pageable);
}