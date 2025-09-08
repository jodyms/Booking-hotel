import { configureStore } from '@reduxjs/toolkit';
import roomReducer from './roomSlice';
import bookingReducer from './bookingSlice';
import dashboardReducer from './dashboardSlice';
import roomServiceReducer from './roomServiceSlice';

export const store = configureStore({
  reducer: {
    rooms: roomReducer,
    bookings: bookingReducer,
    dashboard: dashboardReducer,
    roomService: roomServiceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;