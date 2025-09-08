export interface Booking {
  id: number;
  firstName: string;
  lastName: string;
  pronouns: string;
  checkInDate: string;
  checkOutDate: string;
  adultCapacity: number;
  childrenCapacity: number;
  totalAmount: number;
  status: BookingStatus;
  roomId: number;
  roomNumber: string;
  roomPrice: number;
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = 'BOOKED' | 'CANCELLED' | 'CHECKED_IN' | 'CHECKED_OUT';

export interface BookingFilters {
  search?: string;
  status?: BookingStatus;
}

export interface BookingPaginationParams {
  page: number;
  size: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: BookingFilters;
}

export interface BookingListResponse {
  content: Booking[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface CreateBookingRequest {
  firstName: string;
  lastName: string;
  pronouns: string;
  checkInDate: string;
  checkOutDate: string;
  adultCapacity: number;
  childrenCapacity: number;
  roomId: number;
}

export interface UpdateBookingRequest {
  firstName?: string;
  lastName?: string;
  pronouns?: string;
  checkInDate?: string;
  checkOutDate?: string;
  adultCapacity?: number;
  childrenCapacity?: number;
  status?: BookingStatus;
}

export interface AvailableRoomRequest {
  checkInDate: string;
  checkOutDate: string;
  adultCapacity: number;
  childrenCapacity: number;
}

export interface BookingFormData {
  firstName: string;
  lastName: string;
  pronouns: string;
  checkInDate: string;
  checkOutDate: string;
  adultCapacity: number;
  childrenCapacity: number;
}

export interface RoomSelectionData {
  roomId: number;
  roomNumber: string;
  price: number;
  totalAmount: number;
  numberOfNights: number;
}

// Status display mappings
export const BookingStatusDisplay: Record<BookingStatus, string> = {
  BOOKED: 'Booked',
  CANCELLED: 'Cancelled',
  CHECKED_IN: 'Checked In',
  CHECKED_OUT: 'Checked Out',
};

// Status colors for UI
export const BookingStatusColors: Record<BookingStatus, string> = {
  BOOKED: 'text-blue-600 bg-blue-100',
  CANCELLED: 'text-red-600 bg-red-100',
  CHECKED_IN: 'text-green-600 bg-green-100',
  CHECKED_OUT: 'text-gray-600 bg-gray-100',
};

// Checkout summary types
export interface ServiceCharge {
  name: string;
  amount: number;
}

export interface CheckoutSummary {
  roomTotal: number;
  serviceCharges: ServiceCharge[];
  grandTotal: number;
  totalNights: number;
  checkInDate: string;
  checkOutDate: string;
}