import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { 
  Booking, 
  BookingListResponse, 
  BookingPaginationParams, 
  CreateBookingRequest,
  AvailableRoomRequest,
  CheckoutSummary
} from '../types/booking';
import type { Room } from '../types/room';
import { bookingService } from '../features/bookings/services/bookingService';

interface BookingState {
  bookings: BookingListResponse | null;
  currentBooking: Booking | null;
  availableRooms: Room[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  searchTerm?: string;
  statusFilter?: string;
  // For new booking flow
  bookingForm: {
    firstName: string;
    lastName: string;
    pronouns: string;
    checkInDate: string;
    checkOutDate: string;
    adultCapacity: number;
    childrenCapacity: number;
  };
  selectedRoom: Room | null;
  availableRoomsLoading: boolean;
  availableRoomsError: string | null;
  // For checkout flow
  checkoutSummary: CheckoutSummary | null;
  checkoutLoading: boolean;
  checkoutError: string | null;
}

const initialState: BookingState = {
  bookings: null,
  currentBooking: null,
  availableRooms: [],
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  sortBy: 'createdAt',
  sortDirection: 'desc',
  searchTerm: '',
  statusFilter: '',
  bookingForm: {
    firstName: '',
    lastName: '',
    pronouns: 'Mr',
    checkInDate: '',
    checkOutDate: '',
    adultCapacity: 1,
    childrenCapacity: 0,
  },
  selectedRoom: null,
  availableRoomsLoading: false,
  availableRoomsError: null,
  // For checkout flow
  checkoutSummary: null,
  checkoutLoading: false,
  checkoutError: null,
};

// Async thunks
export const fetchBookings = createAsyncThunk(
  'bookings/fetchBookings',
  async (params: BookingPaginationParams, { rejectWithValue }) => {
    try {
      const response = await bookingService.getAllBookings(params);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bookings';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchBookingById = createAsyncThunk(
  'bookings/fetchBookingById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await bookingService.getBookingById(id);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch booking';
      return rejectWithValue(errorMessage);
    }
  }
);

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (booking: CreateBookingRequest, { rejectWithValue }) => {
    try {
      const response = await bookingService.createBooking(booking);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create booking';
      return rejectWithValue(errorMessage);
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateBookingStatus',
  async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
    try {
      const response = await bookingService.updateBookingStatus(id, status);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update booking status';
      return rejectWithValue(errorMessage);
    }
  }
);

export const cancelBooking = createAsyncThunk(
  'bookings/cancelBooking',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await bookingService.cancelBooking(id);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel booking';
      return rejectWithValue(errorMessage);
    }
  }
);

export const checkInGuest = createAsyncThunk(
  'bookings/checkInGuest',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await bookingService.checkInGuest(id);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check in guest';
      return rejectWithValue(errorMessage);
    }
  }
);

export const checkOutGuest = createAsyncThunk(
  'bookings/checkOutGuest',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await bookingService.checkOutGuest(id);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check out guest';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchAvailableRooms = createAsyncThunk(
  'bookings/fetchAvailableRooms',
  async (params: AvailableRoomRequest, { rejectWithValue }) => {
    try {
      const response = await bookingService.getAvailableRooms(params);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch available rooms';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchCheckoutSummary = createAsyncThunk(
  'bookings/fetchCheckoutSummary',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await bookingService.getCheckoutSummary(id);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch checkout summary';
      return rejectWithValue(errorMessage);
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
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
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearAvailableRoomsError: (state) => {
      state.availableRoomsError = null;
    },
    // Booking form actions
    updateBookingForm: (state, action) => {
      state.bookingForm = { ...state.bookingForm, ...action.payload };
    },
    resetBookingForm: (state) => {
      state.bookingForm = initialState.bookingForm;
    },
    setSelectedRoom: (state, action) => {
      state.selectedRoom = action.payload;
    },
    clearSelectedRoom: (state) => {
      state.selectedRoom = null;
    },
    clearAvailableRooms: (state) => {
      state.availableRooms = [];
    },
    // Checkout actions
    clearCheckoutSummary: (state) => {
      state.checkoutSummary = null;
      state.checkoutError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch bookings
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
        state.error = null;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch booking by ID
    builder
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.error = null;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create booking
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.error = null;
        // Reset form after successful creation
        state.bookingForm = initialState.bookingForm;
        state.selectedRoom = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update booking status
    builder
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.error = null;
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Cancel booking
    builder
      .addCase(cancelBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.error = null;
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Check in guest
    builder
      .addCase(checkInGuest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkInGuest.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.error = null;
      })
      .addCase(checkInGuest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Check out guest
    builder
      .addCase(checkOutGuest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkOutGuest.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.error = null;
      })
      .addCase(checkOutGuest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch available rooms
    builder
      .addCase(fetchAvailableRooms.pending, (state) => {
        state.availableRoomsLoading = true;
        state.availableRoomsError = null;
      })
      .addCase(fetchAvailableRooms.fulfilled, (state, action) => {
        state.availableRoomsLoading = false;
        state.availableRooms = action.payload;
        state.availableRoomsError = null;
      })
      .addCase(fetchAvailableRooms.rejected, (state, action) => {
        state.availableRoomsLoading = false;
        state.availableRoomsError = action.payload as string;
      });

    // Fetch checkout summary
    builder
      .addCase(fetchCheckoutSummary.pending, (state) => {
        state.checkoutLoading = true;
        state.checkoutError = null;
      })
      .addCase(fetchCheckoutSummary.fulfilled, (state, action) => {
        state.checkoutLoading = false;
        state.checkoutSummary = action.payload;
        state.checkoutError = null;
      })
      .addCase(fetchCheckoutSummary.rejected, (state, action) => {
        state.checkoutLoading = false;
        state.checkoutError = action.payload as string;
      });
  },
});

export const { 
  setCurrentPage, 
  setPageSize, 
  setSorting, 
  setSearchTerm, 
  setStatusFilter,
  clearError,
  clearAvailableRoomsError,
  updateBookingForm,
  resetBookingForm,
  setSelectedRoom,
  clearSelectedRoom,
  clearAvailableRooms,
  clearCheckoutSummary
} = bookingSlice.actions;

export default bookingSlice.reducer;