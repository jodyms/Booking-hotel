package com.booking.hotel.repository;

import com.booking.hotel.entity.Booking;
import com.booking.hotel.entity.Room;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    /**
     * Find all bookings with search functionality
     */
    @Query("SELECT b FROM Booking b WHERE " +
           "(:search IS NULL OR LOWER(b.firstName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(b.lastName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR CAST(b.room.roomNumber AS string) LIKE CONCAT('%', :search, '%')) " +
           "AND (:status IS NULL OR b.status = :status)")
    Page<Booking> findAllWithSearch(@Param("search") String search, 
                                   @Param("status") Booking.BookingStatus status, 
                                   Pageable pageable);

    /**
     * Find bookings by room and date range for availability checking
     */
    @Query("SELECT b FROM Booking b WHERE b.room = :room AND " +
           "b.status IN ('BOOKED', 'CHECKED_IN') AND " +
           "((:checkInDate >= b.checkInDate AND :checkInDate < b.checkOutDate) OR " +
           "(:checkOutDate > b.checkInDate AND :checkOutDate <= b.checkOutDate) OR " +
           "(:checkInDate <= b.checkInDate AND :checkOutDate >= b.checkOutDate))")
    List<Booking> findConflictingBookings(@Param("room") Room room,
                                         @Param("checkInDate") LocalDate checkInDate,
                                         @Param("checkOutDate") LocalDate checkOutDate);

    /**
     * Find bookings by date range
     */
    @Query("SELECT b FROM Booking b WHERE " +
           "b.checkInDate >= :startDate AND b.checkInDate <= :endDate")
    List<Booking> findByDateRange(@Param("startDate") LocalDate startDate, 
                                 @Param("endDate") LocalDate endDate);

    /**
     * Find bookings by room
     */
    List<Booking> findByRoom(Room room);

    /**
     * Find bookings by status
     */
    List<Booking> findByStatus(Booking.BookingStatus status);
    
    /**
     * Find bookings by room number and status
     */
    @Query("SELECT b FROM Booking b WHERE b.room.roomNumber = :roomNumber AND b.status = :status")
    List<Booking> findByRoomNumberAndStatus(@Param("roomNumber") String roomNumber, 
                                           @Param("status") Booking.BookingStatus status);

    /**
     * Count bookings by status
     */
    long countByStatus(Booking.BookingStatus status);

    /**
     * Find upcoming check-ins (today or in the future)
     */
    @Query("SELECT b FROM Booking b WHERE b.checkInDate >= :today AND b.status = 'BOOKED'")
    List<Booking> findUpcomingCheckIns(@Param("today") LocalDate today);

    /**
     * Find today's check-ins
     */
    @Query("SELECT b FROM Booking b WHERE b.checkInDate = :today AND b.status = 'BOOKED'")
    List<Booking> findTodayCheckIns(@Param("today") LocalDate today);

    /**
     * Find today's check-outs
     */
    @Query("SELECT b FROM Booking b WHERE b.checkOutDate = :today AND b.status = 'CHECKED_IN'")
    List<Booking> findTodayCheckOuts(@Param("today") LocalDate today);

    /**
     * Find current guests (checked in)
     */
    @Query("SELECT b FROM Booking b WHERE b.status = 'CHECKED_IN'")
    List<Booking> findCurrentGuests();

    /**
     * Check if room is available for booking dates
     */
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN false ELSE true END FROM Booking b WHERE " +
           "b.room = :room AND b.status IN ('BOOKED', 'CHECKED_IN') AND " +
           "((:checkInDate >= b.checkInDate AND :checkInDate < b.checkOutDate) OR " +
           "(:checkOutDate > b.checkInDate AND :checkOutDate <= b.checkOutDate) OR " +
           "(:checkInDate <= b.checkInDate AND :checkOutDate >= b.checkOutDate))")
    boolean isRoomAvailable(@Param("room") Room room,
                           @Param("checkInDate") LocalDate checkInDate,
                           @Param("checkOutDate") LocalDate checkOutDate);

    /**
     * Find available rooms for given date range and capacity
     */
    @Query("SELECT r FROM Room r WHERE r NOT IN (" +
           "SELECT b.room FROM Booking b WHERE " +
           "b.status IN ('BOOKED', 'CHECKED_IN') AND " +
           "((:checkInDate >= b.checkInDate AND :checkInDate < b.checkOutDate) OR " +
           "(:checkOutDate > b.checkInDate AND :checkOutDate <= b.checkOutDate) OR " +
           "(:checkInDate <= b.checkInDate AND :checkOutDate >= b.checkOutDate))" +
           ") AND r.adultCapacity >= :adultCapacity AND r.childrenCapacity >= :childrenCapacity")
    List<Room> findAvailableRooms(@Param("checkInDate") LocalDate checkInDate,
                                 @Param("checkOutDate") LocalDate checkOutDate,
                                 @Param("adultCapacity") Integer adultCapacity,
                                 @Param("childrenCapacity") Integer childrenCapacity);

    /**
     * Count occupied rooms for a specific date
     */
    @Query("SELECT COUNT(DISTINCT b.room) FROM Booking b WHERE " +
           "b.status IN ('BOOKED', 'CHECKED_IN') AND " +
           ":date >= b.checkInDate AND :date < b.checkOutDate")
    long countOccupiedRooms(@Param("date") LocalDate date);

    /**
     * Get weekly occupancy data for dashboard chart
     */
    @Query("SELECT " +
           "FUNCTION('DAY', b.checkInDate), " +
           "COUNT(CASE WHEN b.status = 'BOOKED' OR b.status = 'CHECKED_IN' THEN 1 END), " +
           "COUNT(CASE WHEN b.status = 'CANCELLED' THEN 1 END) " +
           "FROM Booking b WHERE b.checkInDate >= :startDate AND b.checkInDate <= :endDate " +
           "GROUP BY FUNCTION('DAY', b.checkInDate) " +
           "ORDER BY FUNCTION('DAY', b.checkInDate)")
    List<Object[]> getWeeklyOccupancyData(@Param("startDate") LocalDate startDate, 
                                         @Param("endDate") LocalDate endDate);

    /**
     * Check if booking exists by first name, last name and check-in date
     */
    boolean existsByFirstNameAndLastNameAndCheckInDate(String firstName, String lastName, LocalDate checkInDate);
}