package com.booking.hotel.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.Valid;

import java.util.List;

public class OccupancyRateDTO {

    @Valid
    @NotNull(message = "Occupancy data points are required")
    private List<OccupancyDataPointDTO> data;

    @NotNull(message = "Total rooms is required")
    @Min(value = 0, message = "Total rooms must be non-negative")
    private Integer totalRooms;

    @NotNull(message = "Occupied rooms is required")
    @Min(value = 0, message = "Occupied rooms must be non-negative")
    private Integer occupiedRooms;

    @NotNull(message = "Occupancy rate is required")
    @Min(value = 0, message = "Occupancy rate must be non-negative")
    private Double occupancyRate;

    // Default constructor
    public OccupancyRateDTO() {
    }

    // Constructor with parameters
    public OccupancyRateDTO(List<OccupancyDataPointDTO> data, Integer totalRooms, 
                           Integer occupiedRooms, Double occupancyRate) {
        this.data = data;
        this.totalRooms = totalRooms;
        this.occupiedRooms = occupiedRooms;
        this.occupancyRate = occupancyRate;
    }

    // Getters and setters
    public List<OccupancyDataPointDTO> getData() {
        return data;
    }

    public void setData(List<OccupancyDataPointDTO> data) {
        this.data = data;
    }

    public Integer getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(Integer totalRooms) {
        this.totalRooms = totalRooms;
    }

    public Integer getOccupiedRooms() {
        return occupiedRooms;
    }

    public void setOccupiedRooms(Integer occupiedRooms) {
        this.occupiedRooms = occupiedRooms;
    }

    public Double getOccupancyRate() {
        return occupancyRate;
    }

    public void setOccupancyRate(Double occupancyRate) {
        this.occupancyRate = occupancyRate;
    }

    @Override
    public String toString() {
        return "OccupancyRateDTO{" +
                "data=" + data +
                ", totalRooms=" + totalRooms +
                ", occupiedRooms=" + occupiedRooms +
                ", occupancyRate=" + occupancyRate +
                '}';
    }
}