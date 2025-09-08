package com.booking.hotel.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.Valid;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class CheckoutSummaryDTO {

    @NotNull(message = "Room total is required")
    @DecimalMin(value = "0.0", message = "Room total must be non-negative")
    private BigDecimal roomTotal;

    @Valid
    private List<ServiceChargeDTO> serviceCharges;

    @NotNull(message = "Grand total is required")
    @DecimalMin(value = "0.0", message = "Grand total must be non-negative")
    private BigDecimal grandTotal;

    @NotNull(message = "Total nights is required")
    @DecimalMin(value = "1", message = "Total nights must be at least 1")
    private Integer totalNights;

    @NotNull(message = "Check-in date is required")
    private LocalDate checkInDate;

    @NotNull(message = "Check-out date is required")
    private LocalDate checkOutDate;

    // Default constructor
    public CheckoutSummaryDTO() {
    }

    // Constructor with parameters
    public CheckoutSummaryDTO(BigDecimal roomTotal, List<ServiceChargeDTO> serviceCharges,
                             BigDecimal grandTotal, Integer totalNights,
                             LocalDate checkInDate, LocalDate checkOutDate) {
        this.roomTotal = roomTotal;
        this.serviceCharges = serviceCharges;
        this.grandTotal = grandTotal;
        this.totalNights = totalNights;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
    }

    // Getters and setters
    public BigDecimal getRoomTotal() {
        return roomTotal;
    }

    public void setRoomTotal(BigDecimal roomTotal) {
        this.roomTotal = roomTotal;
    }

    public List<ServiceChargeDTO> getServiceCharges() {
        return serviceCharges;
    }

    public void setServiceCharges(List<ServiceChargeDTO> serviceCharges) {
        this.serviceCharges = serviceCharges;
    }

    public BigDecimal getGrandTotal() {
        return grandTotal;
    }

    public void setGrandTotal(BigDecimal grandTotal) {
        this.grandTotal = grandTotal;
    }

    public Integer getTotalNights() {
        return totalNights;
    }

    public void setTotalNights(Integer totalNights) {
        this.totalNights = totalNights;
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

    @Override
    public String toString() {
        return "CheckoutSummaryDTO{" +
                "roomTotal=" + roomTotal +
                ", serviceCharges=" + serviceCharges +
                ", grandTotal=" + grandTotal +
                ", totalNights=" + totalNights +
                ", checkInDate=" + checkInDate +
                ", checkOutDate=" + checkOutDate +
                '}';
    }
}