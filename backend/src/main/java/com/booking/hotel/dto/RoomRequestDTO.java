package com.booking.hotel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;
import java.util.List;

public class RoomRequestDTO {

    @NotBlank(message = "Room number is required")
    @Size(max = 10, message = "Room number must be less than 10 characters")
    private String roomNumber;

    @NotNull(message = "Adult capacity is required")
    @Min(value = 1, message = "Adult capacity must be at least 1")
    private Integer adultCapacity;

    @NotNull(message = "Children capacity is required")
    @Min(value = 0, message = "Children capacity must be at least 0")
    private Integer childrenCapacity;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = true, message = "Price must be greater than or equal to 0")
    private BigDecimal price;

    private List<Long> amenityIds;

    // Default constructor
    public RoomRequestDTO() {
    }

    // Constructor with parameters
    public RoomRequestDTO(String roomNumber, Integer adultCapacity, Integer childrenCapacity, 
                         BigDecimal price, List<Long> amenityIds) {
        this.roomNumber = roomNumber;
        this.adultCapacity = adultCapacity;
        this.childrenCapacity = childrenCapacity;
        this.price = price;
        this.amenityIds = amenityIds;
    }

    // Getters and setters
    public String getRoomNumber() {
        return roomNumber;
    }

    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public List<Long> getAmenityIds() {
        return amenityIds;
    }

    public void setAmenityIds(List<Long> amenityIds) {
        this.amenityIds = amenityIds;
    }

    @Override
    public String toString() {
        return "RoomRequestDTO{" +
                "roomNumber='" + roomNumber + '\'' +
                ", adultCapacity=" + adultCapacity +
                ", childrenCapacity=" + childrenCapacity +
                ", price=" + price +
                ", amenityIds=" + amenityIds +
                '}';
    }
}