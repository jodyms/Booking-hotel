import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { CheckInGuest, CheckOutGuest, OccupancyRateData } from '../types/dashboard';
import { dashboardService } from '../features/dashboard/services/dashboardService';
import { checkInGuest, checkOutGuest } from './bookingSlice';

interface DashboardState {
  // Check-ins data
  todayCheckIns: CheckInGuest[];
  checkInsLoading: boolean;
  checkInsError: string | null;

  // Check-outs data
  todayCheckOuts: CheckOutGuest[];
  checkOutsLoading: boolean;
  checkOutsError: string | null;

  // Occupancy rate data
  occupancyData: OccupancyRateData | null;
  occupancyLoading: boolean;
  occupancyError: string | null;
}

const initialState: DashboardState = {
  // Check-ins
  todayCheckIns: [],
  checkInsLoading: false,
  checkInsError: null,

  // Check-outs
  todayCheckOuts: [],
  checkOutsLoading: false,
  checkOutsError: null,

  // Occupancy
  occupancyData: null,
  occupancyLoading: false,
  occupancyError: null,
};

// Async thunks
export const fetchTodayCheckIns = createAsyncThunk(
  'dashboard/fetchTodayCheckIns',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getTodayCheckIns();
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch today check-ins';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchTodayCheckOuts = createAsyncThunk(
  'dashboard/fetchTodayCheckOuts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getTodayCheckOuts();
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch today check-outs';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchOccupancyRate = createAsyncThunk(
  'dashboard/fetchOccupancyRate',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardService.getOccupancyRate();
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch occupancy rate';
      return rejectWithValue(errorMessage);
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearCheckInsError: (state) => {
      state.checkInsError = null;
    },
    clearCheckOutsError: (state) => {
      state.checkOutsError = null;
    },
    clearOccupancyError: (state) => {
      state.occupancyError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch today check-ins
    builder
      .addCase(fetchTodayCheckIns.pending, (state) => {
        state.checkInsLoading = true;
        state.checkInsError = null;
      })
      .addCase(fetchTodayCheckIns.fulfilled, (state, action) => {
        state.checkInsLoading = false;
        state.todayCheckIns = action.payload;
        state.checkInsError = null;
      })
      .addCase(fetchTodayCheckIns.rejected, (state, action) => {
        state.checkInsLoading = false;
        state.checkInsError = action.payload as string;
      });

    // Fetch today check-outs
    builder
      .addCase(fetchTodayCheckOuts.pending, (state) => {
        state.checkOutsLoading = true;
        state.checkOutsError = null;
      })
      .addCase(fetchTodayCheckOuts.fulfilled, (state, action) => {
        state.checkOutsLoading = false;
        state.todayCheckOuts = action.payload;
        state.checkOutsError = null;
      })
      .addCase(fetchTodayCheckOuts.rejected, (state, action) => {
        state.checkOutsLoading = false;
        state.checkOutsError = action.payload as string;
      });

    // Fetch occupancy rate
    builder
      .addCase(fetchOccupancyRate.pending, (state) => {
        state.occupancyLoading = true;
        state.occupancyError = null;
      })
      .addCase(fetchOccupancyRate.fulfilled, (state, action) => {
        state.occupancyLoading = false;
        state.occupancyData = action.payload;
        state.occupancyError = null;
      })
      .addCase(fetchOccupancyRate.rejected, (state, action) => {
        state.occupancyLoading = false;
        state.occupancyError = action.payload as string;
      });

    // Handle check-in success - refresh today's data
    builder
      .addCase(checkInGuest.fulfilled, () => {
        // We'll refresh data in the component after successful check-in
      })
      .addCase(checkOutGuest.fulfilled, () => {
        // We'll refresh data in the component after successful check-out
      });
  },
});

export const {
  clearCheckInsError,
  clearCheckOutsError,
  clearOccupancyError
} = dashboardSlice.actions;

export default dashboardSlice.reducer;