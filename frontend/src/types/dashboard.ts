// Dashboard related types
export interface CheckInGuest {
  id: number;
  guestName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  dayRemaining: number;
}

export interface CheckOutGuest {
  id: number;
  guestName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  dayRemaining: number;
}

export interface OccupancyDataPoint {
  day: number;
  approved: number;
  declined: number;
}

export interface OccupancyRateData {
  data: OccupancyDataPoint[];
  totalRooms: number;
  occupiedRooms: number;
  occupancyRate: number;
}