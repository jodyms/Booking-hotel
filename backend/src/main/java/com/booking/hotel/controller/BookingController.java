package com.booking.hotel.controller;

import com.booking.hotel.dto.BookingRequestDTO;
import com.booking.hotel.dto.BookingResponseDTO;
import com.booking.hotel.dto.CheckInSummaryDTO;
import com.booking.hotel.dto.CheckoutSummaryDTO;
import com.booking.hotel.entity.Booking;
import com.booking.hotel.entity.Room;
import com.booking.hotel.service.BookingService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    /**
     * GET /api/bookings - Get all bookings with pagination, sorting and filtering
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<Page<BookingResponseDTO>> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDirection,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status
    ) {
        try {
            Booking.BookingStatus bookingStatus = null;
            if (status != null && !status.isEmpty()) {
                try {
                    bookingStatus = Booking.BookingStatus.valueOf(status.toUpperCase());
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().build();
                }
            }

            Page<BookingResponseDTO> bookings = bookingService.getAllBookings(
                page, size, sortBy, sortDirection, search, bookingStatus
            );
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/bookings/{id} - Get booking by ID
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<BookingResponseDTO> getBookingById(@PathVariable Long id) {
        try {
            Optional<BookingResponseDTO> booking = bookingService.getBookingById(id);
            return booking.map(ResponseEntity::ok)
                          .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /api/bookings - Create new booking
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequestDTO bookingRequest) {
        try {
            BookingResponseDTO createdBooking = bookingService.createBooking(bookingRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdBooking);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new ErrorResponse("An error occurred while creating the booking"));
        }
    }

    /**
     * PUT /api/bookings/{id}/status - Update booking status
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long id, 
            @RequestParam String status) {
        try {
            Booking.BookingStatus bookingStatus;
            try {
                bookingStatus = Booking.BookingStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                                    .body(new ErrorResponse("Invalid booking status: " + status));
            }

            BookingResponseDTO updatedBooking = bookingService.updateBookingStatus(id, bookingStatus);
            return ResponseEntity.ok(updatedBooking);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest()
                                .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new ErrorResponse("An error occurred while updating the booking"));
        }
    }

    /**
     * PUT /api/bookings/{id}/cancel - Cancel booking
     */
    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id) {
        try {
            BookingResponseDTO cancelledBooking = bookingService.cancelBooking(id);
            return ResponseEntity.ok(cancelledBooking);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest()
                                .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new ErrorResponse("An error occurred while cancelling the booking"));
        }
    }

    /**
     * PUT /api/bookings/{id}/check-in - Check in guest
     */
    @PutMapping("/{id}/check-in")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> checkInGuest(@PathVariable Long id) {
        try {
            BookingResponseDTO checkedInBooking = bookingService.checkInGuest(id);
            return ResponseEntity.ok(checkedInBooking);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest()
                                .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new ErrorResponse("An error occurred while checking in the guest"));
        }
    }

    /**
     * PUT /api/bookings/{id}/check-out - Check out guest with billing
     */
    @PutMapping("/{id}/check-out")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> checkOutGuest(@PathVariable Long id) {
        try {
            BookingResponseDTO checkedOutBooking = bookingService.processCheckout(id);
            return ResponseEntity.ok(checkedOutBooking);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest()
                                .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new ErrorResponse("An error occurred while checking out the guest"));
        }
    }

    /**
     * GET /api/bookings/{id}/checkout-summary - Get checkout summary with billing
     */
    @GetMapping("/{id}/checkout-summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getCheckoutSummary(@PathVariable Long id) {
        try {
            CheckoutSummaryDTO checkoutSummary = bookingService.getCheckoutSummary(id);
            return ResponseEntity.ok(checkoutSummary);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest()
                                .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new ErrorResponse("An error occurred while fetching checkout summary"));
        }
    }

    /**
     * GET /api/bookings/available-rooms - Get available rooms for booking
     */
    @GetMapping("/available-rooms")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<?> getAvailableRooms(
            @RequestParam String checkInDate,
            @RequestParam String checkOutDate,
            @RequestParam(defaultValue = "1") Integer adultCapacity,
            @RequestParam(defaultValue = "0") Integer childrenCapacity
    ) {
        try {
            LocalDate checkIn = LocalDate.parse(checkInDate);
            LocalDate checkOut = LocalDate.parse(checkOutDate);

            List<Room> availableRooms = bookingService.getAvailableRooms(
                checkIn, checkOut, adultCapacity, childrenCapacity
            );
            
            return ResponseEntity.ok(availableRooms);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                                .body(new ErrorResponse(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new ErrorResponse("An error occurred while fetching available rooms"));
        }
    }

    /**
     * GET /api/bookings/upcoming-checkins - Get upcoming check-ins
     */
    @GetMapping("/upcoming-checkins")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUpcomingCheckIns() {
        try {
            List<BookingResponseDTO> upcomingBookings = bookingService.getUpcomingCheckIns();
            return ResponseEntity.ok(upcomingBookings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new ErrorResponse("An error occurred while fetching upcoming check-ins"));
        }
    }

    /**
     * GET /api/bookings/current-guests - Get current guests
     */
    @GetMapping("/current-guests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getCurrentGuests() {
        try {
            List<BookingResponseDTO> currentGuests = bookingService.getCurrentGuests();
            return ResponseEntity.ok(currentGuests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new ErrorResponse("An error occurred while fetching current guests"));
        }
    }

    /**
     * GET /api/bookings/count - Get total booking count
     */
    @GetMapping("/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BookingCountResponse> getTotalBookingCount() {
        try {
            long count = bookingService.getTotalBookingCount();
            return ResponseEntity.ok(new BookingCountResponse(count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/bookings/count/{status} - Get booking count by status
     */
    @GetMapping("/count/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getBookingCountByStatus(@PathVariable String status) {
        try {
            Booking.BookingStatus bookingStatus;
            try {
                bookingStatus = Booking.BookingStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest()
                                    .body(new ErrorResponse("Invalid booking status: " + status));
            }

            long count = bookingService.getBookingCountByStatus(bookingStatus);
            return ResponseEntity.ok(new BookingCountResponse(count));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/bookings/today/check-ins - Get today's check-ins for dashboard
     */
    @GetMapping("/today/check-ins")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getTodayCheckIns() {
        try {
            List<CheckInSummaryDTO> todayCheckIns = bookingService.getTodayCheckIns();
            return ResponseEntity.ok(todayCheckIns);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new ErrorResponse("An error occurred while fetching today's check-ins"));
        }
    }

    /**
     * GET /api/bookings/today/check-outs - Get today's check-outs for dashboard
     */
    @GetMapping("/today/check-outs")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getTodayCheckOuts() {
        try {
            List<CheckInSummaryDTO> todayCheckOuts = bookingService.getTodayCheckOuts();
            return ResponseEntity.ok(todayCheckOuts);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .body(new ErrorResponse("An error occurred while fetching today's check-outs"));
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

    public static class BookingCountResponse {
        private long count;

        public BookingCountResponse(long count) {
            this.count = count;
        }

        public long getCount() {
            return count;
        }

        public void setCount(long count) {
            this.count = count;
        }
    }
}