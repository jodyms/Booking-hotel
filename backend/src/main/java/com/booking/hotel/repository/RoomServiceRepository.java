package com.booking.hotel.repository;

import com.booking.hotel.entity.RoomService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RoomServiceRepository extends JpaRepository<RoomService, Long> {
    
    /**
     * Find all room services for a specific room number
     */
    List<RoomService> findByRoomNumberOrderByRequestedAtDesc(String roomNumber);
    
    /**
     * Find all room services with a specific status
     */
    List<RoomService> findByStatusOrderByRequestedAtDesc(RoomService.ServiceStatus status);
    
    /**
     * Find all room services created today
     */
    @Query("SELECT rs FROM RoomService rs WHERE DATE(rs.requestedAt) = CURRENT_DATE ORDER BY rs.requestedAt DESC")
    List<RoomService> findTodayServices();
    
    /**
     * Find all pending and in-progress room services
     */
    @Query("SELECT rs FROM RoomService rs WHERE rs.status IN ('PENDING', 'IN_PROGRESS') ORDER BY rs.requestedAt ASC")
    List<RoomService> findActiveServices();
    
    /**
     * Find room services by service type
     */
    List<RoomService> findByServiceTypeOrderByRequestedAtDesc(String serviceType);
    
    /**
     * Find room services within date range
     */
    @Query("SELECT rs FROM RoomService rs WHERE rs.requestedAt BETWEEN :startDate AND :endDate ORDER BY rs.requestedAt DESC")
    List<RoomService> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
    
    /**
     * Count services by status
     */
    long countByStatus(RoomService.ServiceStatus status);
    
    /**
     * Find services by guest name (if available)
     */
    List<RoomService> findByGuestNameContainingIgnoreCaseOrderByRequestedAtDesc(String guestName);
}