import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Room, RoomListResponse, RoomPaginationParams } from '../features/rooms/types';
import { roomService } from '../features/rooms/services/roomService';

interface RoomState {
  rooms: RoomListResponse | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  searchTerm?: string;
}

const initialState: RoomState = {
  rooms: null,
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  sortBy: 'roomNumber',
  sortDirection: 'asc',
  searchTerm: '',
};

export const fetchRooms = createAsyncThunk(
  'rooms/fetchRooms',
  async (params: RoomPaginationParams, { rejectWithValue }) => {
    try {
      const response = await roomService.getAllRooms(params);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch rooms';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchRoomById = createAsyncThunk(
  'rooms/fetchRoomById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await roomService.getRoomById(id);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch room';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createRoom = createAsyncThunk(
  'rooms/createRoom',
  async (room: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await roomService.createRoom(room);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create room';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateRoom = createAsyncThunk(
  'rooms/updateRoom',
  async ({ id, room }: { id: number; room: Partial<Room> }, { rejectWithValue }) => {
    try {
      const response = await roomService.updateRoom(id, room);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update room';
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteRoom = createAsyncThunk(
  'rooms/deleteRoom',
  async (id: number, { rejectWithValue }) => {
    try {
      await roomService.deleteRoom(id);
      return id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete room';
      return rejectWithValue(errorMessage);
    }
  }
);

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    setSorting: (state, action) => {
      state.sortBy = action.payload.sortBy;
      state.sortDirection = action.payload.sortDirection;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch rooms
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
        state.error = null;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
    // Fetch room by ID
    builder
      .addCase(fetchRoomById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomById.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchRoomById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // Create room
    builder
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoom.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // Update room
    builder
      .addCase(updateRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRoom.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // Delete room
    builder
      .addCase(deleteRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRoom.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setCurrentPage, 
  setPageSize, 
  setSorting, 
  setSearchTerm, 
  clearError 
} = roomSlice.actions;

export default roomSlice.reducer;