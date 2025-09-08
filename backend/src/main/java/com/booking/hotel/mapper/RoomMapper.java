package com.booking.hotel.mapper;

import com.booking.hotel.dto.RoomRequestDTO;
import com.booking.hotel.dto.RoomResponseDTO;
import com.booking.hotel.entity.Amenity;
import com.booking.hotel.entity.Room;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class RoomMapper {

    /**
     * Convert Room entity to RoomResponseDTO
     */
    public RoomResponseDTO toResponseDTO(Room room) {
        if (room == null) {
            return null;
        }

        List<RoomResponseDTO.AmenityResponseDTO> amenityDTOs = room.getAmenities()
                .stream()
                .map(this::toAmenityResponseDTO)
                .collect(Collectors.toList());

        return new RoomResponseDTO(
                room.getId(),
                room.getRoomNumber(),
                room.getAdultCapacity(),
                room.getChildrenCapacity(),
                room.getPrice(),
                amenityDTOs,
                room.getCreatedAt(),
                room.getUpdatedAt()
        );
    }

    /**
     * Convert RoomRequestDTO to Room entity
     */
    public Room toEntity(RoomRequestDTO roomRequestDTO) {
        if (roomRequestDTO == null) {
            return null;
        }

        Room room = new Room();
        room.setRoomNumber(roomRequestDTO.getRoomNumber());
        room.setAdultCapacity(roomRequestDTO.getAdultCapacity());
        room.setChildrenCapacity(roomRequestDTO.getChildrenCapacity());
        room.setPrice(roomRequestDTO.getPrice());

        return room;
    }

    /**
     * Update Room entity from RoomRequestDTO
     */
    public void updateEntityFromDTO(RoomRequestDTO dto, Room room) {
        if (dto == null || room == null) {
            return;
        }

        room.setRoomNumber(dto.getRoomNumber());
        room.setAdultCapacity(dto.getAdultCapacity());
        room.setChildrenCapacity(dto.getChildrenCapacity());
        room.setPrice(dto.getPrice());
    }

    /**
     * Convert Amenity entity to AmenityResponseDTO
     */
    private RoomResponseDTO.AmenityResponseDTO toAmenityResponseDTO(Amenity amenity) {
        if (amenity == null) {
            return null;
        }

        return new RoomResponseDTO.AmenityResponseDTO(
                amenity.getId(),
                amenity.getName(),
                amenity.getDescription(),
                amenity.getIcon()
        );
    }

    /**
     * Convert list of Room entities to list of RoomResponseDTOs
     */
    public List<RoomResponseDTO> toResponseDTOList(List<Room> rooms) {
        if (rooms == null) {
            return null;
        }

        return rooms.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convert set of Room entities to list of RoomResponseDTOs
     */
    public List<RoomResponseDTO> toResponseDTOList(Set<Room> rooms) {
        if (rooms == null) {
            return null;
        }

        return rooms.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }
}