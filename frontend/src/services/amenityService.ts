import axios from 'axios';
import authService from '../features/auth/services/authService';
import type { Amenity, AmenityListResponse, AmenityPaginationParams, CreateAmenityRequest, UpdateAmenityRequest } from '../types/amenity';

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
    console.log('Making API request to:', config.url);
  } catch (error) {
    console.error('Failed to get valid token:', error);
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log('API Error:', error.response?.status, error.response?.data);
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

export const amenityService = {
  async testAmenitiesEndpoint(): Promise<unknown> {
    try {
      console.log('Testing amenities endpoint...');
      const response = await api.get('/amenities/test');
      return response.data;
    } catch (error) {
      console.error('Error testing amenities endpoint:', error);
      throw error;
    }
  },

  async getAllAmenities(params: AmenityPaginationParams): Promise<AmenityListResponse> {
    try {
      const queryParams = new URLSearchParams({
        page: (params.page - 1).toString(), // Backend uses 0-based indexing
        size: params.size.toString(),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.sortDirection && { sortDirection: params.sortDirection }),
        ...(params.filters?.search && { search: params.filters.search }),
        ...(params.filters?.activeOnly !== undefined && { activeOnly: params.filters.activeOnly.toString() }),
      });

      const response = await api.get(`/amenities?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching amenities:', error);
      throw error;
    }
  },

  async getAllActiveAmenities(): Promise<Amenity[]> {
    try {
      const response = await api.get('/amenities/active');
      return response.data;
    } catch (error) {
      console.error('Error fetching active amenities:', error);
      throw error;
    }
  },

  async getAmenityById(id: number): Promise<Amenity> {
    try {
      const response = await api.get(`/amenities/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching amenity:', error);
      throw error;
    }
  },

  async getAmenityByName(name: string): Promise<Amenity> {
    try {
      const response = await api.get(`/amenities/name/${name}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching amenity by name:', error);
      throw error;
    }
  },

  async createAmenity(amenity: CreateAmenityRequest): Promise<Amenity> {
    try {
      const response = await api.post('/amenities', amenity);
      return response.data;
    } catch (error) {
      console.error('Error creating amenity:', error);
      throw error;
    }
  },

  async updateAmenity(id: number, amenity: UpdateAmenityRequest): Promise<Amenity> {
    try {
      const response = await api.put(`/amenities/${id}`, amenity);
      return response.data;
    } catch (error) {
      console.error('Error updating amenity:', error);
      throw error;
    }
  },

  async deleteAmenity(id: number): Promise<void> {
    try {
      await api.delete(`/amenities/${id}`);
    } catch (error) {
      console.error('Error deleting amenity:', error);
      throw error;
    }
  },

  async permanentlyDeleteAmenity(id: number): Promise<void> {
    try {
      await api.delete(`/amenities/${id}/permanent`);
    } catch (error) {
      console.error('Error permanently deleting amenity:', error);
      throw error;
    }
  },

  async getTotalActiveAmenityCount(): Promise<number> {
    try {
      const response = await api.get('/amenities/count');
      return response.data.count;
    } catch (error) {
      console.error('Error getting amenity count:', error);
      throw error;
    }
  },

  async checkAmenityNameExists(name: string): Promise<boolean> {
    try {
      const response = await api.get(`/amenities/check-name/${name}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking amenity name:', error);
      throw error;
    }
  },

  async getAmenitiesUsedByRooms(): Promise<Amenity[]> {
    try {
      const response = await api.get('/amenities/used-by-rooms');
      return response.data;
    } catch (error) {
      console.error('Error fetching amenities used by rooms:', error);
      throw error;
    }
  }
};

export default amenityService;