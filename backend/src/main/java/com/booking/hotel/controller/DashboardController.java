package com.booking.hotel.controller;

import com.booking.hotel.dto.OccupancyRateDTO;
import com.booking.hotel.service.DashboardService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*", maxAge = 3600)
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    /**
     * GET /api/dashboard/occupancy-rate - Get weekly occupancy rate data for dashboard
     */
    @GetMapping("/occupancy-rate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getOccupancyRate() {
        try {
            OccupancyRateDTO occupancyRate = dashboardService.getWeeklyOccupancyRate();
            return ResponseEntity.ok(occupancyRate);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new ErrorResponse("An error occurred while fetching occupancy rate data"));
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
}