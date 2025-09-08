import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchTodayCheckIns, fetchTodayCheckOuts, fetchOccupancyRate } from '../../../store/dashboardSlice';
import { 
  checkInGuest, 
  checkOutGuest,
  fetchCheckoutSummary,
  clearCheckoutSummary,
  fetchBookingById
} from '../../../store/bookingSlice';
import type { Booking } from '../../bookings/types';
import type { User } from '../../auth/types';
import type { DashboardProps } from '../types';
import CheckInSection from '../components/CheckInSection';
import CheckOutSection from '../components/CheckOutSection';
import OccupancyChart from '../components/OccupancyChart';
import RoomServiceModal from '../../roomService/components/RoomServiceModal';
import CheckoutModal from '../../bookings/components/CheckoutModal';

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const dispatch = useAppDispatch();
  const [isRoomServiceModalOpen, setIsRoomServiceModalOpen] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [currentBookingForCheckout, setCurrentBookingForCheckout] = useState<Booking | null>(null);
  
  // Use parameters to avoid TypeScript unused variable warning
  console.log('Dashboard mounted for user:', user.name || user.username, 'Logout available:', typeof onLogout);
  const { 
    todayCheckIns, 
    checkInsLoading, 
    todayCheckOuts, 
    checkOutsLoading, 
    occupancyData, 
    occupancyLoading 
  } = useAppSelector((state) => state.dashboard);

  const { 
    checkoutSummary,
    checkoutLoading
  } = useAppSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchTodayCheckIns());
    dispatch(fetchTodayCheckOuts());
    dispatch(fetchOccupancyRate());
  }, [dispatch]);

  const handleRoomServiceClick = () => {
    setIsRoomServiceModalOpen(true);
  };

  const handleRoomServiceModalClose = () => {
    setIsRoomServiceModalOpen(false);
  };

  const handleCheckIn = async (guestId: number) => {
    try {
      console.log('Checking in guest:', guestId);
      
      // Find the guest info for date validation
      const guest = todayCheckIns.find(g => g.id === guestId);
      if (guest) {
        // Date validation - same as BookingDetailPage
        const today = new Date();
        const checkInDate = new Date(guest.checkInDate);
        
        if (checkInDate > today) {
          alert('Cannot check in before the check-in date');
          return;
        }
      }
      
      await dispatch(checkInGuest(guestId));
      // Refresh dashboard data after successful check-in
      dispatch(fetchTodayCheckIns());
      dispatch(fetchTodayCheckOuts());
    } catch (error) {
      console.error('Failed to check in guest:', error);
    }
  };

  const handleCheckOut = async (guestId: number) => {
    try {
      console.log('Preparing checkout for guest:', guestId);
      
      // First, fetch the complete booking data
      const bookingResult = await dispatch(fetchBookingById(guestId));
      if (fetchBookingById.fulfilled.match(bookingResult)) {
        setCurrentBookingForCheckout(bookingResult.payload);
        
        // Fetch checkout summary
        await dispatch(fetchCheckoutSummary(guestId));
        setShowCheckoutModal(true);
      } else {
        console.error('Failed to fetch booking data');
        alert('Failed to load booking information for checkout');
      }
    } catch (error) {
      console.error('Failed to prepare checkout:', error);
    }
  };

  const handleCheckoutConfirm = async () => {
    if (!currentBookingForCheckout) return;
    
    try {
      await dispatch(checkOutGuest(currentBookingForCheckout.id));
      setShowCheckoutModal(false);
      dispatch(clearCheckoutSummary());
      setCurrentBookingForCheckout(null);
      // Refresh dashboard data after successful checkout
      dispatch(fetchTodayCheckIns());
      dispatch(fetchTodayCheckOuts());
    } catch (error) {
      console.error('Failed to check out guest:', error);
    }
  };

  const handleCheckoutCancel = () => {
    setShowCheckoutModal(false);
    dispatch(clearCheckoutSummary());
    setCurrentBookingForCheckout(null);
  };

  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8 bg-gray-50 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Home</h1>
        </div>
        <button 
          onClick={handleRoomServiceClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 md:px-6 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm md:text-base"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-14 0h2m-2 0h-2m28 0h-10a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2z" />
          </svg>
          Room Service
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-8">
        {/* Occupancy Rate Chart */}
        <div className="bg-white rounded-lg shadow-sm order-1 lg:order-1">
          <OccupancyChart 
            data={occupancyData?.data || []}
            loading={occupancyLoading}
          />
        </div>

        {/* Hotel Illustration */}
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 lg:p-8 flex items-center justify-center order-2 lg:order-2">
          <div className="relative w-full h-48 md:h-56 lg:h-64 bg-gradient-to-br from-orange-100 to-yellow-50 rounded-lg flex items-center justify-center overflow-hidden">
            {/* Hotel Building Illustration */}
            <div className="absolute inset-0 flex items-end justify-center">
              {/* Reception Desk */}
              <div className="relative flex items-center justify-center mb-4 md:mb-6 lg:mb-8 scale-75 md:scale-90 lg:scale-100">
                {/* Female Staff */}
                <div className="relative mr-8 md:mr-10 lg:mr-12">
                  <div className="w-10 md:w-11 lg:w-12 h-10 md:h-11 lg:h-12 bg-yellow-400 rounded-full mb-1 md:mb-2"></div>
                  <div className="w-12 md:w-14 lg:w-16 h-16 md:h-18 lg:h-20 bg-yellow-500 rounded-t-lg"></div>
                  <div className="w-16 md:w-18 lg:w-20 h-10 md:h-11 lg:h-12 bg-green-500 rounded-b-lg"></div>
                </div>
                
                {/* Reception Desk */}
                <div className="w-20 md:w-22 lg:w-24 h-10 md:h-11 lg:h-12 bg-amber-700 rounded-lg relative">
                  <div className="absolute -top-1 left-0 right-0 h-2 bg-amber-800 rounded-t-lg"></div>
                </div>
                
                {/* Male Staff */}
                <div className="relative ml-6 md:ml-7 lg:ml-8">
                  <div className="w-10 md:w-11 lg:w-12 h-10 md:h-11 lg:h-12 bg-amber-600 rounded-full mb-1 md:mb-2"></div>
                  <div className="w-12 md:w-14 lg:w-16 h-16 md:h-18 lg:h-20 bg-red-500 rounded-t-lg"></div>
                  <div className="w-16 md:w-18 lg:w-20 h-10 md:h-11 lg:h-12 bg-blue-600 rounded-b-lg"></div>
                </div>
              </div>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-2 md:top-3 lg:top-4 left-2 md:left-3 lg:left-4">
              <div className="w-6 md:w-7 lg:w-8 h-6 md:h-7 lg:h-8 bg-blue-200 rounded-lg shadow-sm"></div>
            </div>
            <div className="absolute top-2 md:top-3 lg:top-4 right-2 md:right-3 lg:right-4">
              <div className="w-6 md:w-7 lg:w-8 h-6 md:h-7 lg:h-8 bg-green-200 rounded-lg shadow-sm"></div>
            </div>
            <div className="absolute top-2 md:top-3 lg:top-4 right-12 md:right-14 lg:right-16">
              <div className="w-6 md:w-7 lg:w-8 h-6 md:h-7 lg:h-8 bg-purple-200 rounded-lg shadow-sm"></div>
            </div>
            
            {/* Hanging Lights */}
            <div className="absolute top-4 md:top-6 lg:top-8 left-1/2 transform -translate-x-1/2 flex gap-2 md:gap-3 lg:gap-4">
              <div className="w-1.5 md:w-2 lg:w-2 h-4 md:h-5 lg:h-6 bg-yellow-400 rounded-full"></div>
              <div className="w-1.5 md:w-2 lg:w-2 h-4 md:h-5 lg:h-6 bg-yellow-400 rounded-full"></div>
              <div className="w-1.5 md:w-2 lg:w-2 h-4 md:h-5 lg:h-6 bg-yellow-400 rounded-full"></div>
              <div className="w-1.5 md:w-2 lg:w-2 h-4 md:h-5 lg:h-6 bg-yellow-400 rounded-full"></div>
            </div>
            
            {/* Plant */}
            <div className="absolute bottom-2 md:bottom-3 lg:bottom-4 right-2 md:right-3 lg:right-4">
              <div className="w-5 md:w-6 lg:w-6 h-6 md:h-7 lg:h-8 bg-green-600 rounded-t-full"></div>
              <div className="w-3 md:w-4 lg:w-4 h-3 md:h-4 lg:h-4 bg-amber-700 rounded-full mx-auto"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Check In and Check Out Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        <CheckInSection 
          guests={todayCheckIns} 
          loading={checkInsLoading}
          onCheckIn={handleCheckIn}
        />
        
        <CheckOutSection 
          guests={todayCheckOuts} 
          loading={checkOutsLoading}
          onCheckOut={handleCheckOut}
        />
      </div>

      {/* Room Service Modal */}
      <RoomServiceModal
        isOpen={isRoomServiceModalOpen}
        onClose={handleRoomServiceModalClose}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        booking={currentBookingForCheckout}
        checkoutSummary={checkoutSummary}
        loading={checkoutLoading}
        onClose={handleCheckoutCancel}
        onConfirm={handleCheckoutConfirm}
      />
    </div>
  );
};

export default Dashboard;