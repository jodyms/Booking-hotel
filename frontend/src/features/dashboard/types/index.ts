import type { User } from '../../auth/types';

export interface DashboardProps {
  user: User;
  onLogout: () => void;
}

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
  totalAmount: number;
  dayRemaining?: number;
}

export interface CheckInSectionProps {
  guests: CheckInGuest[];
  loading?: boolean;
  onCheckIn: (guestId: number) => void;
  className?: string;
}

export interface CheckOutSectionProps {
  guests: CheckOutGuest[];
  loading?: boolean;
  onCheckOut: (guestId: number) => void;
  onViewDetails?: (guestId: number) => void;
  className?: string;
}

export interface GuestCardProps {
  guest?: CheckInGuest | CheckOutGuest;
  guestName: string;
  roomNumber: string;
  leavingDate: string;
  dayRemaining: number;
  buttonText: string;
  buttonColor: string;
  onButtonClick: () => void;
  actionButton?: React.ReactNode;
  className?: string;
}

export interface OccupancyDataPoint {
  day: number;
  approved: number;
  declined: number;
}

export interface OccupancyChartProps {
  data: OccupancyDataPoint[];
  loading?: boolean;
  className?: string;
}

export interface OccupancyRateData {
  rate: number;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  data?: OccupancyDataPoint[];
}