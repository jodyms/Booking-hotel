import axios from 'axios';
import authService from '../../auth/services/authService';
import type { Room, RoomListResponse, RoomPaginationParams, CreateRoomRequest, UpdateRoomRequest } from '../../../types/room';

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

export const roomService = {
  async getAllRooms(params: RoomPaginationParams): Promise<RoomListResponse> {
    try {
      const queryParams = new URLSearchParams({
        page: (params.page - 1).toString(), // Backend uses 0-based indexing
        size: params.size.toString(),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.sortDirection && { sortDirection: params.sortDirection }),
        ...(params.filters?.search && { search: params.filters.search }),
        ...(params.filters?.minPrice && { minPrice: params.filters.minPrice.toString() }),
        ...(params.filters?.maxPrice && { maxPrice: params.filters.maxPrice.toString() }),
        ...(params.filters?.adultCapacity && { adultCapacity: params.filters.adultCapacity.toString() }),
        ...(params.filters?.childrenCapacity && { childrenCapacity: params.filters.childrenCapacity.toString() }),
      });

      const response = await api.get(`/rooms?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  },

  async getRoomById(id: number): Promise<Room> {
    try {
      const response = await api.get(`/rooms/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching room:', error);
      throw error;
    }
  },

  async createRoom(room: CreateRoomRequest): Promise<Room> {
    try {
      const response = await api.post('/rooms', room);
      return response.data;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },

  async updateRoom(id: number, room: UpdateRoomRequest | Room): Promise<Room> {
    try {
      console.log('Updating room via API:', { id, room });
      const response = await api.put(`/rooms/${id}`, room);
      console.log('Room update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating room:', error);
      throw error;
    }
  },

  async deleteRoom(id: number): Promise<void> {
    try {
      await api.delete(`/rooms/${id}`);
    } catch (error) {
      console.error('Error deleting room:', error);
      throw error;
    }
  }
};

export default roomService;