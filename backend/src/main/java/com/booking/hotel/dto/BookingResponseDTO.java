package com.booking.hotel.dto;

import com.booking.hotel.entity.Booking;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class BookingResponseDTO {

    private Long id;
    private String firstName;
    private String lastName;
    private String pronouns;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate checkInDate;
    
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate checkOutDate;
    
    private Integer adultCapacity;
    private Integer childrenCapacity;
    private BigDecimal totalAmount;
    private String status;
    
    // Room details
    private Long roomId;
    private String roomNumber;
    private BigDecimal roomPrice;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    // Default constructor
    public BookingResponseDTO() {
    }

    // Constructor from entity
    public BookingResponseDTO(Booking booking) {
        this.id = booking.getId();
        this.firstName = booking.getFirstName();
        this.lastName = booking.getLastName();
        this.pronouns = booking.getPronouns();
        this.checkInDate = booking.getCheckInDate();
        this.checkOutDate = booking.getCheckOutDate();
        this.adultCapacity = booking.getAdultCapacity();
        this.childrenCapacity = booking.getChildrenCapacity();
        this.totalAmount = booking.getTotalAmount();
        this.status = booking.getStatus().name();
        this.createdAt = booking.getCreatedAt();
        this.updatedAt = booking.getUpdatedAt();
        
        // Set room details if room is available
        if (booking.getRoom() != null) {
            this.roomId = booking.getRoom().getId();
            this.roomNumber = booking.getRoom().getRoomNumber();
            this.roomPrice = booking.getRoom().getPrice();
        }
    }

    // Constructor with all fields
    public BookingResponseDTO(Long id, String firstName, String lastName, String pronouns,
                            LocalDate checkInDate, LocalDate checkOutDate, 
                            Integer adultCapacity, Integer childrenCapacity,
                            BigDecimal totalAmount, String status, Long roomId, 
                            String roomNumber, BigDecimal roomPrice,
                            LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.pronouns = pronouns;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.adultCapacity = adultCapacity;
        this.childrenCapacity = childrenCapacity;
        this.totalAmount = totalAmount;
        this.status = status;
        this.roomId = roomId;
        this.roomNumber = roomNumber;
        this.roomPrice = roomPrice;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getRoomId() {
        return roomId;
    }

    public void setRoomId(Long roomId) {
        this.roomId = roomId;
    }

    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }

    public BigDecimal getRoomPrice() {
        return roomPrice;
    }

    public void setRoomPrice(BigDecimal roomPrice) {
        this.roomPrice = roomPrice;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Helper methods
    public String getGuestFullName() {
        return firstName + " " + lastName;
    }

    public String getFormattedCheckInDate() {
        return checkInDate != null ? checkInDate.toString() : "-";
    }

    public String getFormattedCheckOutDate() {
        return checkOutDate != null ? checkOutDate.toString() : "-";
    }

    public String getFormattedStatus() {
        if (status == null) return "Unknown";
        
        switch (status) {
            case "BOOKED":
                return "Booked";
            case "CANCELLED":
                return "Cancelled";
            case "CHECKED_IN":
                return "Checked In";
            case "CHECKED_OUT":
                return "Checked Out";
            default:
                return status;
        }
    }

    @Override
    public String toString() {
        return "BookingResponseDTO{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", pronouns='" + pronouns + '\'' +
                ", checkInDate=" + checkInDate +
                ", checkOutDate=" + checkOutDate +
                ", adultCapacity=" + adultCapacity +
                ", childrenCapacity=" + childrenCapacity +
                ", totalAmount=" + totalAmount +
                ", status='" + status + '\'' +
                ", roomId=" + roomId +
                ", roomNumber='" + roomNumber + '\'' +
                ", roomPrice=" + roomPrice +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}