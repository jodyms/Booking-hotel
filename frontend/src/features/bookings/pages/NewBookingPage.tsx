import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../../store';
import {
  updateBookingForm,
  resetBookingForm,
  setSelectedRoom,
  clearSelectedRoom,
  fetchAvailableRooms,
  createBooking,
  clearError,
  clearAvailableRoomsError,
} from '../../../store/bookingSlice';
import type { BookingFormData } from '../types';
import type { Room } from '../../rooms/types';

const NewBookingPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const {
    bookingForm,
    selectedRoom,
    availableRooms,
    availableRoomsLoading,
    availableRoomsError,
    loading,
    error,
  } = useSelector((state: RootState) => state.bookings);

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof BookingFormData, string>>>({});
  const [hasSearchedRooms, setHasSearchedRooms] = useState(false);

  useEffect(() => {
    // Clear errors when component mounts
    dispatch(clearError());
    dispatch(clearAvailableRoomsError());
    
    // Reset form when component unmounts
    return () => {
      dispatch(resetBookingForm());
      dispatch(clearSelectedRoom());
    };
  }, [dispatch]);

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof BookingFormData, string>> = {};

    if (!bookingForm.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!bookingForm.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!bookingForm.checkInDate) {
      errors.checkInDate = 'Check-in date is required';
    }

    if (!bookingForm.checkOutDate) {
      errors.checkOutDate = 'Check-out date is required';
    }

    if (bookingForm.checkInDate && bookingForm.checkOutDate) {
      const checkIn = new Date(bookingForm.checkInDate);
      const checkOut = new Date(bookingForm.checkOutDate);
      
      if (checkOut <= checkIn) {
        errors.checkOutDate = 'Check-out date must be after check-in date';
      }

      if (checkIn < new Date(new Date().toDateString())) {
        errors.checkInDate = 'Check-in date cannot be in the past';
      }
    }

    if (!bookingForm.adultCapacity || bookingForm.adultCapacity < 1) {
      errors.adultCapacity = 'At least 1 adult is required';
    }

    if (bookingForm.childrenCapacity < 0) {
      errors.childrenCapacity = 'Children capacity cannot be negative';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (data: Partial<BookingFormData>) => {
    dispatch(updateBookingForm(data));
    
    // Clear specific field error when user starts typing
    if (formErrors) {
      const newErrors = { ...formErrors };
      Object.keys(data).forEach((key) => {
        delete newErrors[key as keyof BookingFormData];
      });
      setFormErrors(newErrors);
    }
  };

  const handleGetAvailableRooms = () => {
    if (!validateForm()) {
      return;
    }

    dispatch(fetchAvailableRooms({
      checkInDate: bookingForm.checkInDate,
      checkOutDate: bookingForm.checkOutDate,
      adultCapacity: bookingForm.adultCapacity,
      childrenCapacity: bookingForm.childrenCapacity,
    }));

    setHasSearchedRooms(true);
  };

  const handleRoomSelect = (room: Room) => {
    dispatch(setSelectedRoom(room));
  };

  const calculateNumberOfNights = (): number => {
    if (!bookingForm.checkInDate || !bookingForm.checkOutDate) return 0;
    
    const checkIn = new Date(bookingForm.checkInDate);
    const checkOut = new Date(bookingForm.checkOutDate);
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalAmount = (room: Room): number => {
    return room.price * calculateNumberOfNights();
  };

  const handleBookRoom = async () => {
    if (!selectedRoom) return;

    const bookingRequest = {
      firstName: bookingForm.firstName,
      lastName: bookingForm.lastName,
      pronouns: bookingForm.pronouns,
      checkInDate: bookingForm.checkInDate,
      checkOutDate: bookingForm.checkOutDate,
      adultCapacity: bookingForm.adultCapacity,
      childrenCapacity: bookingForm.childrenCapacity,
      roomId: selectedRoom.id,
    };

    try {
      await dispatch(createBooking(bookingRequest)).unwrap();
      // Success! Navigate to bookings list with success message
      navigate('/bookings', { 
        state: { 
          message: 'Booking created successfully!',
          type: 'success' 
        } 
      });
    } catch (error) {
      console.error('Booking creation failed:', error);
    }
  };

  const handleBack = () => {
    navigate('/bookings');
  };

  const numberOfNights = calculateNumberOfNights();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">New Booking</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          {/* Guest Information */}
          <div className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                value={bookingForm.firstName}
                onChange={(e) => handleFormChange({ firstName: e.target.value })}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.firstName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Uchiha"
              />
              {formErrors.firstName && (
                <p className="mt-1 text-sm text-red-600">{formErrors.firstName}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                value={bookingForm.lastName}
                onChange={(e) => handleFormChange({ lastName: e.target.value })}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.lastName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Sasuke"
              />
              {formErrors.lastName && (
                <p className="mt-1 text-sm text-red-600">{formErrors.lastName}</p>
              )}
            </div>

            <div>
              <label htmlFor="pronouns" className="block text-sm font-medium text-gray-700">
                Pronouns
              </label>
              <select
                id="pronouns"
                value={bookingForm.pronouns}
                onChange={(e) => handleFormChange({ pronouns: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select pronouns</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
              </select>
            </div>
          </div>

          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700">
                Check In Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="checkInDate"
                value={bookingForm.checkInDate}
                onChange={(e) => handleFormChange({ checkInDate: e.target.value })}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.checkInDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.checkInDate && (
                <p className="mt-1 text-sm text-red-600">{formErrors.checkInDate}</p>
              )}
            </div>

            <div>
              <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700">
                Check Out Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="checkOutDate"
                value={bookingForm.checkOutDate}
                onChange={(e) => handleFormChange({ checkOutDate: e.target.value })}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.checkOutDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {formErrors.checkOutDate && (
                <p className="mt-1 text-sm text-red-600">{formErrors.checkOutDate}</p>
              )}
            </div>
          </div>

          {/* Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="adultCapacity" className="block text-sm font-medium text-gray-700">
                Adult Capacity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="adultCapacity"
                min="1"
                value={bookingForm.adultCapacity}
                onChange={(e) => handleFormChange({ adultCapacity: parseInt(e.target.value) || 0 })}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.adultCapacity ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="2"
              />
              {formErrors.adultCapacity && (
                <p className="mt-1 text-sm text-red-600">{formErrors.adultCapacity}</p>
              )}
            </div>

            <div>
              <label htmlFor="childrenCapacity" className="block text-sm font-medium text-gray-700">
                Children Capacity
              </label>
              <input
                type="number"
                id="childrenCapacity"
                min="0"
                value={bookingForm.childrenCapacity}
                onChange={(e) => handleFormChange({ childrenCapacity: parseInt(e.target.value) || 0 })}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.childrenCapacity ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0"
              />
              {formErrors.childrenCapacity && (
                <p className="mt-1 text-sm text-red-600">{formErrors.childrenCapacity}</p>
              )}
            </div>
          </div>

          {/* Available Room Section */}
          {hasSearchedRooms && (
            <div className="border-t pt-6">
              {availableRoomsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Searching for available rooms...</span>
                </div>
              ) : availableRoomsError ? (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="text-red-800">
                    <h3 className="text-sm font-medium">Error loading available rooms</h3>
                    <p className="mt-1 text-sm">{availableRoomsError}</p>
                  </div>
                </div>
              ) : availableRooms.length === 0 ? (
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium text-gray-900">No Available Rooms</h3>
                  <p className="mt-1 text-gray-500">
                    No rooms are available for the selected dates and capacity.
                  </p>
                </div>
              ) : selectedRoom ? (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Available Room</h3>
                  <div className="text-blue-600 text-2xl font-semibold">{selectedRoom.roomNumber}</div>
                  <div className="text-gray-600 text-lg">$ {selectedRoom.price} per Night</div>
                  {numberOfNights > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      {numberOfNights} night{numberOfNights > 1 ? 's' : ''} × ${selectedRoom.price} = ${calculateTotalAmount(selectedRoom)}
                    </div>
                  )}
                </div>
              ) : availableRooms.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700">Available Rooms</h3>
                  <div className="space-y-2">
                    {availableRooms.map((room) => (
                      <div
                        key={room.id}
                        className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleRoomSelect(room)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-blue-600">{room.roomNumber}</div>
                            <div className="text-gray-600">$ {room.price} per Night</div>
                          </div>
                          <div className="text-sm text-gray-500">
                            Capacity: {room.adultCapacity} adults, {room.childrenCapacity} children
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-red-800">
                <h3 className="text-sm font-medium">Booking Error</h3>
                <p className="mt-1 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-6">
            <button
              onClick={handleBack}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back
            </button>
            
            <div className="space-x-3">
              <button
                onClick={handleGetAvailableRooms}
                disabled={availableRoomsLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {availableRoomsLoading ? 'Searching...' : 'Get Available Room'}
              </button>
              
              <button
                onClick={handleBookRoom}
                disabled={!selectedRoom || loading}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Booking Room...
                  </span>
                ) : (
                  'Book Room'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewBookingPage;