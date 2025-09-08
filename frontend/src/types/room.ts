import type { Amenity } from './amenity';

export interface Room {
  id: number;
  roomNumber: string;
  adultCapacity: number;
  childrenCapacity: number;
  price: number;
  amenities?: Amenity[];
  createdAt?: string;
  updatedAt?: string;
}

export interface RoomFilters {
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  adultCapacity?: number;
  childrenCapacity?: number;
}

export interface RoomPaginationParams {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: RoomFilters;
}

export interface RoomListResponse {
  content: Room[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface CreateRoomRequest {
  roomNumber: string;
  adultCapacity: number;
  childrenCapacity: number;
  price: number;
  amenityIds?: number[];
}

export interface UpdateRoomRequest {
  roomNumber?: string;
  adultCapacity?: number;
  childrenCapacity?: number;
  price?: number;
  amenityIds?: number[];
}