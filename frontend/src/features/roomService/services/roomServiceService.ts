import axios from 'axios';
import authService from '../../auth/services/authService';
import type { 
  RoomService, 
  CreateRoomServiceRequest 
} from '../../../types/roomService';

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

export const roomServiceService = {
  /**
   * Create new room service request
   */
  async createRoomService(request: CreateRoomServiceRequest): Promise<RoomService> {
    try {
      const response = await api.post('/room-services', request);
      return response.data;
    } catch (error) {
      console.error('Error creating room service request:', error);
      throw error;
    }
  },

  /**
   * Get all room service requests
   */
  async getAllRoomServices(): Promise<RoomService[]> {
    try {
      const response = await api.get('/room-services');
      return response.data;
    } catch (error) {
      console.error('Error fetching room services:', error);
      throw error;
    }
  },

  /**
   * Get room service by ID
   */
  async getRoomServiceById(id: number): Promise<RoomService> {
    try {
      const response = await api.get(`/room-services/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching room service:', error);
      throw error;
    }
  },

  /**
   * Update room service status
   */
  async updateRoomServiceStatus(id: number, status: string): Promise<RoomService> {
    try {
      const response = await api.put(`/room-services/${id}/status?status=${status}`);
      return response.data;
    } catch (error) {
      console.error('Error updating room service status:', error);
      throw error;
    }
  },

  /**
   * Delete room service request
   */
  async deleteRoomService(id: number): Promise<void> {
    try {
      await api.delete(`/room-services/${id}`);
    } catch (error) {
      console.error('Error deleting room service:', error);
      throw error;
    }
  }
};

export default roomServiceService;