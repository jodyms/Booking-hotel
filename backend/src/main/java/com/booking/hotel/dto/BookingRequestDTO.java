package com.booking.hotel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

public class BookingRequestDTO {

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must be less than 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must be less than 50 characters")
    private String lastName;

    @NotBlank(message = "Pronouns are required")
    @Size(max = 20, message = "Pronouns must be less than 20 characters")
    private String pronouns;

    @NotNull(message = "Check-in date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate checkInDate;

    @NotNull(message = "Check-out date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate checkOutDate;

    @NotNull(message = "Adult capacity is required")
    @Min(value = 1, message = "Adult capacity must be at least 1")
    private Integer adultCapacity;

    @NotNull(message = "Children capacity is required")
    @Min(value = 0, message = "Children capacity must be at least 0")
    private Integer childrenCapacity;

    @NotNull(message = "Room ID is required")
    private Long roomId;

    // Default constructor
    public BookingRequestDTO() {
    }

    // Constructor with all fields
    public BookingRequestDTO(String firstName, String lastName, String pronouns, 
                           LocalDate checkInDate, LocalDate checkOutDate, 
                           Integer adultCapacity, Integer childrenCapacity, Long roomId) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.pronouns = pronouns;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.adultCapacity = adultCapacity;
        this.childrenCapacity = childrenCapacity;
        this.roomId = roomId;
    }

    // Getters and setters
    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPronouns() {
        return pronouns;
    }

    public void setPronouns(String pronouns) {
        this.pronouns = pronouns;
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

    public Integer getAdultCapacity() {
        return adultCapacity;
    }

    public void setAdultCapacity(Integer adultCapacity) {
        this.adultCapacity = adultCapacity;
    }

    public Integer getChildrenCapacity() {
        return childrenCapacity;
    }

    public void setChildrenCapacity(Integer childrenCapacity) {
        this.childrenCapacity = childrenCapacity;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    // Validation method
    public boolean isValidDateRange() {
        if (checkInDate == null || checkOutDate == null) {
            return false;
        }
        return checkInDate.isBefore(checkOutDate);
    }

    @Override
    public String toString() {
        return "BookingRequestDTO{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", pronouns='" + pronouns + '\'' +
                ", checkInDate=" + checkInDate +
                ", checkOutDate=" + checkOutDate +
                ", adultCapacity=" + adultCapacity +
                ", childrenCapacity=" + childrenCapacity +
                ", roomId=" + roomId +
                '}';
    }
}