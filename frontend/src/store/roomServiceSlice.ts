import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RoomService, CreateRoomServiceRequest } from '../types/roomService';
import { roomServiceService } from '../features/roomService/services/roomServiceService';

interface RoomServiceState {
  // Room services data
  roomServices: RoomService[];
  currentRoomService: RoomService | null;
  
  // Loading states
  loading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;
  
  // Error states
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
  
  // Success state for showing notifications
  createSuccess: boolean;
}

const initialState: RoomServiceState = {
  roomServices: [],
  currentRoomService: null,
  loading: false,
  createLoading: false,
  updateLoading: false,
  deleteLoading: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
  createSuccess: false,
};

// Async thunks
export const createRoomService = createAsyncThunk(
  'roomService/create',
  async (request: CreateRoomServiceRequest, { rejectWithValue }) => {
    try {
      const response = await roomServiceService.createRoomService(request);
      return response;
    } catch (error) {
      const errorMessage = error && typeof error === 'object' && 'response' in error
        ? (error as { response?: { data?: { message?: string } }; message?: string }).response?.data?.message || 
          (error as { message?: string }).message || 'Failed to create room service request'
        : 'Failed to create room service request';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchRoomServices = createAsyncThunk(
  'roomService/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await roomServiceService.getAllRoomServices();
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch room services';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateRoomServiceStatus = createAsyncThunk(
  'roomService/updateStatus',
  async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
    try {
      const response = await roomServiceService.updateRoomServiceStatus(id, status);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update room service status';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteRoomService = createAsyncThunk(
  'roomService/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await roomServiceService.deleteRoomService(id);
      return id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete room service';
      return rejectWithValue(errorMessage);
    }
  }
);

const roomServiceSlice = createSlice({
  name: 'roomService',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
    clearCreateSuccess: (state) => {
      state.createSuccess = false;
    },
    setCurrentRoomService: (state, action) => {
      state.currentRoomService = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Create room service
    builder
      .addCase(createRoomService.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createRoomService.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createError = null;
        state.createSuccess = true;
        state.roomServices.unshift(action.payload);
      })
      .addCase(createRoomService.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload as string;
        state.createSuccess = false;
      });

    // Fetch room services
    builder
      .addCase(fetchRoomServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomServices.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.roomServices = action.payload;
      })
      .addCase(fetchRoomServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update room service status
    builder
      .addCase(updateRoomServiceStatus.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateRoomServiceStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateError = null;
        const index = state.roomServices.findIndex(service => service.id === action.payload.id);
        if (index !== -1) {
          state.roomServices[index] = action.payload;
        }
        if (state.currentRoomService?.id === action.payload.id) {
          state.currentRoomService = action.payload;
        }
      })
      .addCase(updateRoomServiceStatus.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      });

    // Delete room service
    builder
      .addCase(deleteRoomService.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteRoomService.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = null;
        state.roomServices = state.roomServices.filter(service => service.id !== action.payload);
        if (state.currentRoomService?.id === action.payload) {
          state.currentRoomService = null;
        }
      })
      .addCase(deleteRoomService.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const {
  clearErrors,
  clearCreateSuccess,
  setCurrentRoomService,
} = roomServiceSlice.actions;

export default roomServiceSlice.reducer;