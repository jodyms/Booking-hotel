import axios from 'axios';
import authService from '../../auth/services/authService';
import type { 
  Booking, 
  BookingListResponse, 
  BookingPaginationParams, 
  CreateBookingRequest, 
  AvailableRoomRequest,
  CheckoutSummary
} from '../types';
import type { Room } from '../../rooms/types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  try {
    const token = await authService.getValidToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Failed to get valid token:', error);
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log('Authentication failed - attempting token refresh');
      try {
        const newToken = await authService.getValidToken();
        if (newToken && error.config) {
          // Retry the original request with new token
          error.config.headers.Authorization = `Bearer ${newToken}`;
          return api.request(error.config);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        authService.clearTokens();
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export const bookingService = {
  /**
   * Get all bookings with pagination and filtering
   */
  async getAllBookings(params: BookingPaginationParams): Promise<BookingListResponse> {
    try {
      const queryParams = new URLSearchParams({
        page: (params.page - 1).toString(), // Backend uses 0-based indexing
        size: params.size.toString(),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.sortDirection && { sortDirection: params.sortDirection }),
        ...(params.filters?.search && { search: params.filters.search }),
        ...(params.filters?.status && { status: params.filters.status }),
      });

      const response = await api.get(`/bookings?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  /**
   * Get booking by ID
   */
  async getBookingById(id: number): Promise<Booking> {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  },

  /**
   * Create new booking
   */
  async createBooking(booking: CreateBookingRequest): Promise<Booking> {
    try {
      const response = await api.post('/bookings', booking);
      return response.data;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  },

  /**
   * Update booking status
   */
  async updateBookingStatus(id: number, status: string): Promise<Booking> {
    try {
      const response = await api.put(`/bookings/${id}/status?status=${status}`);
      return response.data;
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  },

  /**
   * Cancel booking
   */
  async cancelBooking(id: number): Promise<Booking> {
    try {
      const response = await api.put(`/bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  },

  /**
   * Check in guest
   */
  async checkInGuest(id: number): Promise<Booking> {
    try {
      const response = await api.put(`/bookings/${id}/check-in`);
      return response.data;
    } catch (error) {
      console.error('Error checking in guest:', error);
      throw error;
    }
  },

  /**
   * Check out guest
   */
  async checkOutGuest(id: number): Promise<Booking> {
    try {
      const response = await api.put(`/bookings/${id}/check-out`);
      return response.data;
    } catch (error) {
      console.error('Error checking out guest:', error);
      throw error;
    }
  },

  /**
   * Get checkout summary with billing details
   */
  async getCheckoutSummary(id: number): Promise<CheckoutSummary> {
    try {
      const response = await api.get(`/bookings/${id}/checkout-summary`);
      return response.data;
    } catch (error) {
      console.error('Error fetching checkout summary:', error);
      throw error;
    }
  },

  /**
   * Get available rooms for booking dates
   */
  async getAvailableRooms(params: AvailableRoomRequest): Promise<Room[]> {
    try {
      const queryParams = new URLSearchParams({
        checkInDate: params.checkInDate,
        checkOutDate: params.checkOutDate,
        adultCapacity: params.adultCapacity.toString(),
        childrenCapacity: params.childrenCapacity.toString(),
      });

      const response = await api.get(`/bookings/available-rooms?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching available rooms:', error);
      throw error;
    }
  },

  /**
   * Get upcoming check-ins
   */
  async getUpcomingCheckIns(): Promise<Booking[]> {
    try {
      const response = await api.get('/bookings/upcoming-checkins');
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming check-ins:', error);
      throw error;
    }
  },

  /**
   * Get current guests
   */
  async getCurrentGuests(): Promise<Booking[]> {
    try {
      const response = await api.get('/bookings/current-guests');
      return response.data;
    } catch (error) {
      console.error('Error fetching current guests:', error);
      throw error;
    }
  },

  /**
   * Get total booking count
   */
  async getTotalBookingCount(): Promise<number> {
    try {
      const response = await api.get('/bookings/count');
      return response.data.count;
    } catch (error) {
      console.error('Error fetching booking count:', error);
      throw error;
    }
  },

  /**
   * Get booking count by status
   */
  async getBookingCountByStatus(status: string): Promise<number> {
    try {
      const response = await api.get(`/bookings/count/${status}`);
      return response.data.count;
    } catch (error) {
      console.error('Error fetching booking count by status:', error);
      throw error;
    }
  },
};

export default bookingService;