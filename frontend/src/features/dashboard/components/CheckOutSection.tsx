import React from 'react';
import GuestCard from './GuestCard';
import type { CheckOutGuest, CheckOutSectionProps } from '../types';

const CheckOutSection: React.FC<CheckOutSectionProps> = ({
  guests,
  loading = false,
  onCheckOut,
  className = ''
}) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg p-6 ${className}`}>
        <div className="border-b-4 border-orange-400 pb-2 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Check Out</h2>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse flex items-center justify-between py-4">
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-6 bg-gray-200 rounded w-12"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (guests.length === 0) {
    return (
      <div className={`bg-white rounded-lg p-6 ${className}`}>
        <div className="border-b-4 border-orange-400 pb-2 mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Check Out</h2>
        </div>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No guests scheduled for check-out today</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      <div className="border-b-4 border-orange-400 pb-2 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Check Out</h2>
      </div>
      
      <div className="space-y-0 divide-y divide-gray-100">
        {guests.map((guest) => (
          <GuestCard
            key={guest.id}
            guestName={guest.guestName}
            roomNumber={guest.roomNumber}
            leavingDate={formatDate(guest.checkOutDate)}
            dayRemaining={guest.dayRemaining}
            buttonText="Check Out"
            buttonColor="blue"
            onButtonClick={() => onCheckOut(guest.id)}
            className="first:pt-0"
          />
        ))}
      </div>
    </div>
  );
};

export default CheckOutSection;