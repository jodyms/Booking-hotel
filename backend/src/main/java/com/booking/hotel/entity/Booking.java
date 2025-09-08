package com.booking.hotel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "First name is required")
    @Size(max = 50, message = "First name must be less than 50 characters")
    @Column(name = "first_name", nullable = false, length = 50)
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(max = 50, message = "Last name must be less than 50 characters")
    @Column(name = "last_name", nullable = false, length = 50)
    private String lastName;

    @NotBlank(message = "Pronouns are required")
    @Size(max = 20, message = "Pronouns must be less than 20 characters")
    @Column(name = "pronouns", nullable = false, length = 20)
    private String pronouns;

    @NotNull(message = "Check-in date is required")
    @Column(name = "check_in_date", nullable = false)
    private LocalDate checkInDate;

    @NotNull(message = "Check-out date is required")
    @Column(name = "check_out_date", nullable = false)
    private LocalDate checkOutDate;

    @NotNull(message = "Adult capacity is required")
    @Min(value = 1, message = "Adult capacity must be at least 1")
    @Column(name = "adult_capacity", nullable = false)
    private Integer adultCapacity;

    @NotNull(message = "Children capacity is required")
    @Min(value = 0, message = "Children capacity must be at least 0")
    @Column(name = "children_capacity", nullable = false)
    private Integer childrenCapacity;

    @NotNull(message = "Total amount is required")
    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BookingStatus status = BookingStatus.BOOKED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum BookingStatus {
        BOOKED,
        CANCELLED,
        CHECKED_IN,
        CHECKED_OUT
    }

    // Default constructor for JPA
    public Booking() {
    }

    // Constructor with parameters
    public Booking(String firstName, String lastName, String pronouns, 
                   LocalDate checkInDate, LocalDate checkOutDate, 
                   Integer adultCapacity, Integer childrenCapacity, 
                   Room room, BigDecimal totalAmount) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.pronouns = pronouns;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.adultCapacity = adultCapacity;
        this.childrenCapacity = childrenCapacity;
        this.room = room;
        this.totalAmount = totalAmount;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
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

    public BookingStatus getStatus() {
        return status;
    }

    public void setStatus(BookingStatus status) {
        this.status = status;
    }

    public Room getRoom() {
        return room;
    }

    public void setRoom(Room room) {
        this.room = room;
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

    public String getGuestFullName() {
        return firstName + " " + lastName;
    }

    public String getFormattedCheckInDate() {
        return checkInDate != null ? checkInDate.toString() : "-";
    }

    public String getFormattedCheckOutDate() {
        return checkOutDate != null ? checkOutDate.toString() : "-";
    }

    @Override
    public String toString() {
        return "Booking{" +
                "id=" + id +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", pronouns='" + pronouns + '\'' +
                ", checkInDate=" + checkInDate +
                ", checkOutDate=" + checkOutDate +
                ", adultCapacity=" + adultCapacity +
                ", childrenCapacity=" + childrenCapacity +
                ", totalAmount=" + totalAmount +
                ", status=" + status +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}