import axios from 'axios';
import authService from '../../auth/services/authService';
import type { CheckInGuest, CheckOutGuest, OccupancyRateData } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with auth token
const createApiInstance = async () => {
  const token = await authService.getValidToken();
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  });
};

export const dashboardService = {
  /**
   * Get today's check-ins
   */
  async getTodayCheckIns(): Promise<CheckInGuest[]> {
    try {
      const api = await createApiInstance();
      const response = await api.get('/bookings/today/check-ins');
      return response.data;
    } catch (error) {
      console.error('Error fetching today check-ins:', error);
      throw error;
    }
  },

  /**
   * Get today's check-outs
   */
  async getTodayCheckOuts(): Promise<CheckOutGuest[]> {
    try {
      const api = await createApiInstance();
      const response = await api.get('/bookings/today/check-outs');
      return response.data;
    } catch (error) {
      console.error('Error fetching today check-outs:', error);
      throw error;
    }
  },

  /**
   * Get weekly occupancy rate data
   */
  async getOccupancyRate(): Promise<OccupancyRateData> {
    try {
      const api = await createApiInstance();
      const response = await api.get('/dashboard/occupancy-rate');
      return response.data;
    } catch (error) {
      console.error('Error fetching occupancy rate:', error);
      throw error;
    }
  },
};

export default dashboardService;