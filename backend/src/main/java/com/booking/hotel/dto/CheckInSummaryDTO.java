package com.booking.hotel.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;

import java.time.LocalDate;

public class CheckInSummaryDTO {

    @NotNull(message = "Booking ID is required")
    private Long id;

    @NotBlank(message = "Guest name is required")
    private String guestName;

    @NotBlank(message = "Room number is required")
    private String roomNumber;

    @NotNull(message = "Check-in date is required")
    private LocalDate checkInDate;

    @NotNull(message = "Check-out date is required")
    private LocalDate checkOutDate;

    @Min(value = 0, message = "Days remaining cannot be negative")
    private Integer dayRemaining;

    // Default constructor
    public CheckInSummaryDTO() {
    }

    // Constructor with parameters
    public CheckInSummaryDTO(Long id, String guestName, String roomNumber, 
                            LocalDate checkInDate, LocalDate checkOutDate, Integer dayRemaining) {
        this.id = id;
        this.guestName = guestName;
        this.roomNumber = roomNumber;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.dayRemaining = dayRemaining;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGuestName() {
        return guestName;
    }

    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(LocalDate checkOutDate) {
        this.checkOutDate = checkOutDate;
    }

    public Integer getDayRemaining() {
        return dayRemaining;
    }

    public void setDayRemaining(Integer dayRemaining) {
        this.dayRemaining = dayRemaining;
    }

    @Override
    public String toString() {
        return "CheckInSummaryDTO{" +
                "id=" + id +
                ", guestName='" + guestName + '\'' +
                ", roomNumber='" + roomNumber + '\'' +
                ", checkInDate=" + checkInDate +
                ", checkOutDate=" + checkOutDate +
                ", dayRemaining=" + dayRemaining +
                '}';
    }
}