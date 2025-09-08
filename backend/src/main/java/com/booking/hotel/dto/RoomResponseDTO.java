package com.booking.hotel.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class RoomResponseDTO {

    private Long id;
    private String roomNumber;
    private Integer adultCapacity;
    private Integer childrenCapacity;
    private BigDecimal price;
    private List<AmenityResponseDTO> amenities;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Default constructor
    public RoomResponseDTO() {
    }

    // Constructor with parameters
    public RoomResponseDTO(Long id, String roomNumber, Integer adultCapacity, 
                          Integer childrenCapacity, BigDecimal price, 
                          List<AmenityResponseDTO> amenities, 
                          LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.roomNumber = roomNumber;
        this.adultCapacity = adultCapacity;
        this.childrenCapacity = childrenCapacity;
        this.price = price;
        this.amenities = amenities;
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

    public List<AmenityResponseDTO> getAmenities() {
        return amenities;
    }

    public void setAmenities(List<AmenityResponseDTO> amenities) {
        this.amenities = amenities;
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

    @Override
    public String toString() {
        return "RoomResponseDTO{" +
                "id=" + id +
                ", roomNumber='" + roomNumber + '\'' +
                ", adultCapacity=" + adultCapacity +
                ", childrenCapacity=" + childrenCapacity +
                ", price=" + price +
                ", amenities=" + amenities +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }

    // Nested DTO for Amenity
    public static class AmenityResponseDTO {
        private Long id;
        private String name;
        private String description;
        private String icon;

        // Default constructor
        public AmenityResponseDTO() {
        }

        // Constructor with parameters
        public AmenityResponseDTO(Long id, String name, String description, String icon) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.icon = icon;
        }

        // Getters and setters
        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public String getIcon() {
            return icon;
        }

        public void setIcon(String icon) {
            this.icon = icon;
        }

        @Override
        public String toString() {
            return "AmenityResponseDTO{" +
                    "id=" + id +
                    ", name='" + name + '\'' +
                    ", description='" + description + '\'' +
                    ", icon='" + icon + '\'' +
                    '}';
        }
    }
}