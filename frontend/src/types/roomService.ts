export interface RoomService {
  id: number;
  roomNumber: string;
  serviceType: string;
  amount: number;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  requestedAt: string;
  completedAt?: string;
  guestName?: string;
}

export interface CreateRoomServiceRequest {
  roomNumber: string;
  serviceType: string;
  amount: number;
  description?: string;
}

export type RoomServiceRequestDTO = CreateRoomServiceRequest;

export interface RoomServiceListResponse {
  content: RoomService[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export const ROOM_SERVICE_TYPES = [
  { value: 'CLEANING', label: 'Room Cleaning' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'FOOD_DELIVERY', label: 'Food Delivery' },
  { value: 'LAUNDRY', label: 'Laundry Service' },
  { value: 'MINI_BAR', label: 'Mini Bar Refill' },
  { value: 'TOWEL_CHANGE', label: 'Towel Change' },
  { value: 'AMENITIES', label: 'Room Amenities' },
  { value: 'OTHER', label: 'Other Service' }
] as const;