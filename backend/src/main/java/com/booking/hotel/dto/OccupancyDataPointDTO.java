package com.booking.hotel.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

public class OccupancyDataPointDTO {

    @NotNull(message = "Day is required")
    @Min(value = 0, message = "Day must be non-negative")
    private Integer day;

    @Min(value = 0, message = "Approved count must be non-negative")
    private Integer approved;

    @Min(value = 0, message = "Declined count must be non-negative")
    private Integer declined;

    // Default constructor
    public OccupancyDataPointDTO() {
    }

    // Constructor with parameters
    public OccupancyDataPointDTO(Integer day, Integer approved, Integer declined) {
        this.day = day;
        this.approved = approved;
        this.declined = declined;
    }

    // Getters and setters
    public Integer getDay() {
        return day;
    }

    public void setDay(Integer day) {
        this.day = day;
    }

    public Integer getApproved() {
        return approved;
    }

    public void setApproved(Integer approved) {
        this.approved = approved;
    }

    public Integer getDeclined() {
        return declined;
    }

    public void setDeclined(Integer declined) {
        this.declined = declined;
    }

    @Override
    public String toString() {
        return "OccupancyDataPointDTO{" +
                "day=" + day +
                ", approved=" + approved +
                ", declined=" + declined +
                '}';
    }
}