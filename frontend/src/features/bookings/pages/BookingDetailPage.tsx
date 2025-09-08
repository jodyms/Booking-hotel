import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../../store';
import { 
  fetchBookingById, 
  checkInGuest, 
  cancelBooking,
  checkOutGuest,
  fetchCheckoutSummary,
  clearCheckoutSummary
} from '../../../store/bookingSlice';
import CheckoutModal from '../components/CheckoutModal';

const BookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { 
    currentBooking, 
    loading, 
    error,
    checkoutSummary,
    checkoutLoading
  } = useSelector((state: RootState) => state.bookings);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    pronouns: 'Mr',
    checkInDate: '',
    checkOutDate: '',
    adultCapacity: 2,
    childrenCapacity: 0
  });
  
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Handle ESC key to close modals and body scroll lock
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (showCancelDialog) {
          setShowCancelDialog(false);
        }
        if (showCheckInDialog) {
          setShowCheckInDialog(false);
        }
        if (showCheckoutModal) {
          setShowCheckoutModal(false);
        }
      }
    };

    // Lock body scroll when modal is open
    if (showCancelDialog || showCheckInDialog || showCheckoutModal) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscKey);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showCancelDialog, showCheckInDialog, showCheckoutModal]);

  useEffect(() => {
    if (id) {
      dispatch(fetchBookingById(Number(id)));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentBooking) {
      setFormData({
        firstName: currentBooking.firstName,
        lastName: currentBooking.lastName,
        pronouns: currentBooking.pronouns,
        checkInDate: currentBooking.checkInDate,
        checkOutDate: currentBooking.checkOutDate,
        adultCapacity: currentBooking.adultCapacity,
        childrenCapacity: currentBooking.childrenCapacity
      });
    }
  }, [currentBooking]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Capacity') ? parseInt(value) || 0 : value
    }));
  };

  const handleBack = () => {
    navigate('/bookings');
  };

  const handleCancel = async () => {
    if (!currentBooking) return;
    
    try {
      await dispatch(cancelBooking(currentBooking.id));
      setShowCancelDialog(false);
      // Refresh booking data
      dispatch(fetchBookingById(currentBooking.id));
    } catch (error) {
      console.error('Failed to cancel booking:', error);
    }
  };

  const handleCheckIn = async () => {
    if (!currentBooking) return;
    
    // Date validation
    const today = new Date();
    const checkInDate = new Date(currentBooking.checkInDate);
    
    if (checkInDate > today) {
      alert('Cannot check in before the check-in date');
      return;
    }
    
    try {
      await dispatch(checkInGuest(currentBooking.id));
      setShowCheckInDialog(false);
      // Refresh booking data
      dispatch(fetchBookingById(currentBooking.id));
    } catch (error) {
      console.error('Failed to check in guest:', error);
    }
  };

  const handleCheckoutClick = async () => {
    if (!currentBooking) return;
    
    try {
      // Fetch checkout summary
      await dispatch(fetchCheckoutSummary(currentBooking.id));
      setShowCheckoutModal(true);
    } catch (error) {
      console.error('Failed to fetch checkout summary:', error);
    }
  };

  const handleCheckoutConfirm = async () => {
    if (!currentBooking) return;
    
    try {
      await dispatch(checkOutGuest(currentBooking.id));
      setShowCheckoutModal(false);
      dispatch(clearCheckoutSummary());
      // Refresh booking data
      dispatch(fetchBookingById(currentBooking.id));
    } catch (error) {
      console.error('Failed to check out guest:', error);
    }
  };

  const handleCheckoutCancel = () => {
    setShowCheckoutModal(false);
    dispatch(clearCheckoutSummary());
  };

  const canCheckIn = currentBooking?.status === 'BOOKED';
  const canCancel = currentBooking?.status === 'BOOKED';
  const canCheckOut = currentBooking?.status === 'CHECKED_IN';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading booking details...</div>
      </div>
    );
  }

  if (error || !currentBooking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">
          {error || 'Booking not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Booking Details</h1>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={true}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={true}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pronouns</label>
            <select
              name="pronouns"
              value={formData.pronouns}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={true}
            >
              <option value="Mr">Mr</option>
              <option value="Mrs">Mrs</option>
              <option value="Ms">Ms</option>
              <option value="Dr">Dr</option>
              <option value="Prof">Prof</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check In Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={true}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Check Out Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={true}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adult Capacity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="adultCapacity"
                value={formData.adultCapacity}
                onChange={handleInputChange}
                min="1"
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={true}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Children Capacity</label>
              <input
                type="number"
                name="childrenCapacity"
                value={formData.childrenCapacity}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={true}
              />
            </div>
          </div>

          {/* Booking Status */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                currentBooking.status === 'BOOKED' ? 'bg-blue-100 text-blue-800' :
                currentBooking.status === 'CHECKED_IN' ? 'bg-green-100 text-green-800' :
                currentBooking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {currentBooking.status.replace('_', ' ')}
              </span>
            </div>
            <div className="mt-2">
              <span className="font-medium text-gray-700">Room:</span>
              <span className="ml-2 text-gray-600">#{currentBooking.roomNumber}</span>
            </div>
            <div className="mt-1">
              <span className="font-medium text-gray-700">Total Amount:</span>
              <span className="ml-2 text-gray-600">${currentBooking.totalAmount}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Back
            </button>
            
            {canCancel && (
              <button
                onClick={() => setShowCancelDialog(true)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancel
              </button>
            )}
            
            {canCheckIn && (
              <button
                onClick={() => setShowCheckInDialog(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Check In
              </button>
            )}
            
            {canCheckOut && (
              <button
                onClick={handleCheckoutClick}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Check Out
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div 
          className="fixed inset-0 bg-opacity-20 backdrop-blur-xs flex items-center justify-center p-4 z-50"
          onClick={() => setShowCancelDialog(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Cancel Booking</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this booking? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Check In Confirmation Dialog */}
      {showCheckInDialog && (
        <div 
          className="fixed inset-0 bg-opacity-20 backdrop-blur-xs flex items-center justify-center p-4 z-50"
          onClick={() => setShowCheckInDialog(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-4">Check In Guest</h3>
            <p className="text-gray-600 mb-6">
              Confirm check-in for {currentBooking.firstName} {currentBooking.lastName}?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCheckInDialog(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckIn}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Check In
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        booking={currentBooking}
        checkoutSummary={checkoutSummary}
        loading={checkoutLoading}
        onClose={handleCheckoutCancel}
        onConfirm={handleCheckoutConfirm}
      />
    </div>
  );
};

export default BookingDetailPage;