package com.booking.hotel.service;

import com.booking.hotel.dto.OccupancyDataPointDTO;
import com.booking.hotel.dto.OccupancyRateDTO;
import com.booking.hotel.repository.BookingRepository;
import com.booking.hotel.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    /**
     * Get weekly occupancy rate data for dashboard chart
     */
    public OccupancyRateDTO getWeeklyOccupancyRate() {
        try {
            LocalDate today = LocalDate.now();
            LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);
            LocalDate endOfWeek = today.with(DayOfWeek.SUNDAY);

            // Get weekly occupancy data from repository
            List<Object[]> weeklyData = bookingRepository.getWeeklyOccupancyData(startOfWeek, endOfWeek);
            
            // Convert to DTO format
            List<OccupancyDataPointDTO> dataPoints = new ArrayList<>();
            for (Object[] row : weeklyData) {
                Integer day = (Integer) row[0];
                Long approved = (Long) row[1];
                Long declined = (Long) row[2];
                
                dataPoints.add(new OccupancyDataPointDTO(
                    day,
                    approved.intValue(),
                    declined.intValue()
                ));
            }

            // Calculate current occupancy rate
            long totalRooms = roomRepository.count();
            long occupiedRooms = bookingRepository.countOccupiedRooms(today);
            double occupancyRate = totalRooms > 0 ? (double) occupiedRooms / totalRooms * 100 : 0.0;

            return new OccupancyRateDTO(
                dataPoints,
                (int) totalRooms,
                (int) occupiedRooms,
                occupancyRate
            );
        } catch (Exception e) {
            throw new RuntimeException("Error calculating occupancy rate: " + e.getMessage(), e);
        }
    }
}