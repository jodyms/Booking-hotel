package com.booking.hotel.service;

import com.booking.hotel.dto.BookingRequestDTO;
import com.booking.hotel.dto.BookingResponseDTO;
import com.booking.hotel.dto.CheckInSummaryDTO;
import com.booking.hotel.dto.CheckoutSummaryDTO;
import com.booking.hotel.dto.ServiceChargeDTO;
import com.booking.hotel.entity.Booking;
import com.booking.hotel.entity.Room;
import com.booking.hotel.entity.RoomService;
import com.booking.hotel.repository.BookingRepository;
import com.booking.hotel.repository.RoomRepository;
import com.booking.hotel.repository.RoomServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.LockModeType;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private EntityManager entityManager;
    
    @Autowired
    private RoomServiceRepository roomServiceRepository;

    /**
     * Get all bookings with pagination, sorting, and search
     */
    public Page<BookingResponseDTO> getAllBookings(int page, int size, String sortBy, 
                                                   String sortDirection, String search, 
                                                   Booking.BookingStatus status) {
        try {
            // Validate sort direction
            Sort.Direction direction = sortDirection.equalsIgnoreCase("desc") ? 
                Sort.Direction.DESC : Sort.Direction.ASC;

            // Create sort object
            Sort sort = Sort.by(direction, sortBy);
            Pageable pageable = PageRequest.of(page, size, sort);

            // Fetch bookings with search and status filter
            Page<Booking> bookingPage = bookingRepository.findAllWithSearch(search, status, pageable);

            // Convert to DTOs
            return bookingPage.map(BookingResponseDTO::new);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching bookings: " + e.getMessage(), e);
        }
    }

    /**
     * Get booking by ID
     */
    public Optional<BookingResponseDTO> getBookingById(Long id) {
        try {
            return bookingRepository.findById(id)
                    .map(BookingResponseDTO::new);
        } catch (Exception e) {
            throw new RuntimeException("Error fetching booking with id " + id + ": " + e.getMessage(), e);
        }
    }

    /**
     * Create new booking with availability check and pessimistic locking
     */
    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO bookingRequest) {
        try {
            // Validation
            if (!bookingRequest.isValidDateRange()) {
                throw new RuntimeException("Invalid date range: Check-out date must be after check-in date");
            }

            if (bookingRequest.getCheckInDate().isBefore(LocalDate.now())) {
                throw new RuntimeException("Check-in date cannot be in the past");
            }

            // Get room with pessimistic lock to prevent concurrent bookings
            Room room = roomRepository.findById(bookingRequest.getRoomId())
                    .orElseThrow(() -> new RuntimeException("Room not found with id: " + bookingRequest.getRoomId()));

            // Apply pessimistic lock
            entityManager.lock(room, LockModeType.PESSIMISTIC_WRITE);

            // Check room capacity
            if (room.getAdultCapacity() < bookingRequest.getAdultCapacity()) {
                throw new RuntimeException("Room adult capacity (" + room.getAdultCapacity() + 
                        ") is insufficient for requested capacity (" + bookingRequest.getAdultCapacity() + ")");
            }

            if (room.getChildrenCapacity() < bookingRequest.getChildrenCapacity()) {
                throw new RuntimeException("Room children capacity (" + room.getChildrenCapacity() + 
                        ") is insufficient for requested capacity (" + bookingRequest.getChildrenCapacity() + ")");
            }

            // Check availability
            boolean isAvailable = bookingRepository.isRoomAvailable(
                    room, 
                    bookingRequest.getCheckInDate(), 
                    bookingRequest.getCheckOutDate()
            );

            if (!isAvailable) {
                throw new RuntimeException("Room " + room.getRoomNumber() + 
                        " is not available for the selected dates");
            }

            // Calculate total amount
            long numberOfNights = ChronoUnit.DAYS.between(
                    bookingRequest.getCheckInDate(), 
                    bookingRequest.getCheckOutDate()
            );
            BigDecimal totalAmount = room.getPrice().multiply(BigDecimal.valueOf(numberOfNights));

            // Create booking entity
            Booking booking = new Booking(
                    bookingRequest.getFirstName(),
                    bookingRequest.getLastName(),
                    bookingRequest.getPronouns(),
                    bookingRequest.getCheckInDate(),
                    bookingRequest.getCheckOutDate(),
                    bookingRequest.getAdultCapacity(),
                    bookingRequest.getChildrenCapacity(),
                    room,
                    totalAmount
            );

            // Save booking
            Booking savedBooking = bookingRepository.save(booking);

            return new BookingResponseDTO(savedBooking);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error creating booking: " + e.getMessage(), e);
        }
    }

    /**
     * Update booking status
     */
    public BookingResponseDTO updateBookingStatus(Long id, Booking.BookingStatus status) {
        try {
            Booking booking = bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

            booking.setStatus(status);
            Booking updatedBooking = bookingRepository.save(booking);

            return new BookingResponseDTO(updatedBooking);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error updating booking status: " + e.getMessage(), e);
        }
    }

    /**
     * Cancel booking
     */
    public BookingResponseDTO cancelBooking(Long id) {
        return updateBookingStatus(id, Booking.BookingStatus.CANCELLED);
    }

    /**
     * Check in guest
     */
    public BookingResponseDTO checkInGuest(Long id) {
        try {
            Booking booking = bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

            if (booking.getStatus() != Booking.BookingStatus.BOOKED) {
                throw new RuntimeException("Cannot check in: Booking status is " + booking.getStatus());
            }

            if (booking.getCheckInDate().isAfter(LocalDate.now())) {
                throw new RuntimeException("Cannot check in before check-in date");
            }

            return updateBookingStatus(id, Booking.BookingStatus.CHECKED_IN);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error checking in guest: " + e.getMessage(), e);
        }
    }

    /**
     * Check out guest
     */
    public BookingResponseDTO checkOutGuest(Long id) {
        try {
            Booking booking = bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

            if (booking.getStatus() != Booking.BookingStatus.CHECKED_IN) {
                throw new RuntimeException("Cannot check out: Guest is not checked in");
            }

            return updateBookingStatus(id, Booking.BookingStatus.CHECKED_OUT);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error checking out guest: " + e.getMessage(), e);
        }
    }

    /**
     * Get available rooms for given criteria
     */
    public List<Room> getAvailableRooms(LocalDate checkInDate, LocalDate checkOutDate, 
                                       Integer adultCapacity, Integer childrenCapacity) {
        try {
            if (checkInDate == null || checkOutDate == null) {
                throw new RuntimeException("Check-in and check-out dates are required");
            }

            if (checkInDate.isAfter(checkOutDate) || checkInDate.isEqual(checkOutDate)) {
                throw new RuntimeException("Check-out date must be after check-in date");
            }

            if (checkInDate.isBefore(LocalDate.now())) {
                throw new RuntimeException("Check-in date cannot be in the past");
            }

            return bookingRepository.findAvailableRooms(
                    checkInDate, checkOutDate, 
                    adultCapacity != null ? adultCapacity : 1, 
                    childrenCapacity != null ? childrenCapacity : 0
            );
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error fetching available rooms: " + e.getMessage(), e);
        }
    }

    /**
     * Get bookings by date range
     */
    public List<BookingResponseDTO> getBookingsByDateRange(LocalDate startDate, LocalDate endDate) {
        try {
            List<Booking> bookings = bookingRepository.findByDateRange(startDate, endDate);
            return bookings.stream()
                    .map(BookingResponseDTO::new)
                    .toList();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching bookings by date range: " + e.getMessage(), e);
        }
    }

    /**
     * Get upcoming check-ins
     */
    public List<BookingResponseDTO> getUpcomingCheckIns() {
        try {
            List<Booking> bookings = bookingRepository.findUpcomingCheckIns(LocalDate.now());
            return bookings.stream()
                    .map(BookingResponseDTO::new)
                    .toList();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching upcoming check-ins: " + e.getMessage(), e);
        }
    }

    /**
     * Get current guests (checked in)
     */
    public List<BookingResponseDTO> getCurrentGuests() {
        try {
            List<Booking> bookings = bookingRepository.findCurrentGuests();
            return bookings.stream()
                    .map(BookingResponseDTO::new)
                    .toList();
        } catch (Exception e) {
            throw new RuntimeException("Error fetching current guests: " + e.getMessage(), e);
        }
    }

    /**
     * Get total booking count
     */
    public long getTotalBookingCount() {
        try {
            return bookingRepository.count();
        } catch (Exception e) {
            throw new RuntimeException("Error counting bookings: " + e.getMessage(), e);
        }
    }

    /**
     * Get booking count by status
     */
    public long getBookingCountByStatus(Booking.BookingStatus status) {
        try {
            return bookingRepository.countByStatus(status);
        } catch (Exception e) {
            throw new RuntimeException("Error counting bookings by status: " + e.getMessage(), e);
        }
    }

    /**
     * Get checkout summary with billing calculation
     */
    public CheckoutSummaryDTO getCheckoutSummary(Long id) {
        try {
            Booking booking = bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

            if (booking.getStatus() != Booking.BookingStatus.CHECKED_IN) {
                throw new RuntimeException("Cannot get checkout summary: Guest is not checked in");
            }

            LocalDate checkInDate = booking.getCheckInDate();
            LocalDate checkOutDate = LocalDate.now(); // Current date for checkout
            
            // Calculate total nights
            long totalNights = ChronoUnit.DAYS.between(checkInDate, checkOutDate);
            if (totalNights < 1) {
                totalNights = 1; // Minimum 1 night
            }

            // Calculate room total
            BigDecimal roomTotal = booking.getRoom().getPrice().multiply(BigDecimal.valueOf(totalNights));

            // Calculate service charges (tax + cleaning fee + room services)
            List<ServiceChargeDTO> serviceCharges = new ArrayList<>();
            
            // Add tax (10% of room total)
            BigDecimal tax = roomTotal.multiply(BigDecimal.valueOf(0.10));
            serviceCharges.add(new ServiceChargeDTO("Tax (10%)", tax));
            
            // Add cleaning fee
            BigDecimal cleaningFee = BigDecimal.valueOf(3000); // Fixed cleaning fee
            serviceCharges.add(new ServiceChargeDTO("Cleaning Fee", cleaningFee));
            
            // Add room service charges
            BigDecimal roomServicesTotal = BigDecimal.ZERO;
            List<RoomService> roomServicesList = roomServiceRepository.findByRoomNumberOrderByRequestedAtDesc(booking.getRoom().getRoomNumber());
            
            for (RoomService roomService : roomServicesList) {
                // Only include completed services
                if (roomService.getStatus() == RoomService.ServiceStatus.COMPLETED) {
                    String serviceName = roomService.getServiceType() + " - " + 
                                      (roomService.getDescription() != null ? roomService.getDescription() : "Room Service");
                    serviceCharges.add(new ServiceChargeDTO(serviceName, roomService.getAmount()));
                    roomServicesTotal = roomServicesTotal.add(roomService.getAmount());
                }
            }

            // Calculate grand total
            BigDecimal grandTotal = roomTotal.add(tax).add(cleaningFee).add(roomServicesTotal);

            return new CheckoutSummaryDTO(
                roomTotal,
                serviceCharges,
                grandTotal,
                (int) totalNights,
                checkInDate,
                checkOutDate
            );
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error calculating checkout summary: " + e.getMessage(), e);
        }
    }

    /**
     * Process checkout with billing calculation
     */
    @Transactional
    public BookingResponseDTO processCheckout(Long id) {
        try {
            Booking booking = bookingRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

            if (booking.getStatus() != Booking.BookingStatus.CHECKED_IN) {
                throw new RuntimeException("Cannot check out: Guest is not checked in");
            }

            // Get checkout summary for billing calculation
            CheckoutSummaryDTO checkoutSummary = getCheckoutSummary(id);
            
            // Update booking with final amount
            booking.setTotalAmount(checkoutSummary.getGrandTotal());
            
            // Update status to checked out
            booking.setStatus(Booking.BookingStatus.CHECKED_OUT);
            
            Booking updatedBooking = bookingRepository.save(booking);
            return new BookingResponseDTO(updatedBooking);
        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error processing checkout: " + e.getMessage(), e);
        }
    }

    /**
     * Get today's check-ins for dashboard
     */
    public List<CheckInSummaryDTO> getTodayCheckIns() {
        try {
            List<Booking> bookings = bookingRepository.findTodayCheckIns(LocalDate.now());
            return bookings.stream()
                    .map(booking -> {
                        String guestName = booking.getFirstName() + " " + booking.getLastName();
                        String roomNumber = booking.getRoom().getRoomNumber();
                        LocalDate checkInDate = booking.getCheckInDate();
                        LocalDate checkOutDate = booking.getCheckOutDate();
                        int daysRemaining = (int) ChronoUnit.DAYS.between(LocalDate.now(), checkOutDate);
                        
                        return new CheckInSummaryDTO(
                            booking.getId(),
                            guestName,
                            roomNumber,
                            checkInDate,
                            checkOutDate,
                            Math.max(0, daysRemaining)
                        );
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching today's check-ins: " + e.getMessage(), e);
        }
    }

    /**
     * Get today's check-outs for dashboard
     */
    public List<CheckInSummaryDTO> getTodayCheckOuts() {
        try {
            List<Booking> bookings = bookingRepository.findTodayCheckOuts(LocalDate.now());
            return bookings.stream()
                    .map(booking -> {
                        String guestName = booking.getFirstName() + " " + booking.getLastName();
                        String roomNumber = booking.getRoom().getRoomNumber();
                        LocalDate checkInDate = booking.getCheckInDate();
                        LocalDate checkOutDate = booking.getCheckOutDate();
                        int daysRemaining = 0; // Already checking out today
                        
                        return new CheckInSummaryDTO(
                            booking.getId(),
                            guestName,
                            roomNumber,
                            checkInDate,
                            checkOutDate,
                            daysRemaining
                        );
                    })
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Error fetching today's check-outs: " + e.getMessage(), e);
        }
    }
}