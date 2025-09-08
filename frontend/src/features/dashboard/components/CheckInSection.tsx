import React from 'react';
import GuestCard from './GuestCard';

interface CheckInGuest {
  id: number;
  guestName: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  dayRemaining: number;
}

interface CheckInSectionProps {
  guests: CheckInGuest[];
  loading?: boolean;
  onCheckIn: (guestId: number) => void;
  className?: string;
}

const CheckInSection: React.FC<CheckInSectionProps> = ({
  guests,
  loading = false,
  onCheckIn,
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
          <h2 className="text-xl font-semibold text-gray-900">Check In</h2>
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
          <h2 className="text-xl font-semibold text-gray-900">Check In</h2>
        </div>
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">No guests scheduled for check-in today</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      <div className="border-b-4 border-orange-400 pb-2 mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Check In</h2>
      </div>
      
      <div className="space-y-0 divide-y divide-gray-100">
        {guests.map((guest) => (
          <GuestCard
            key={guest.id}
            guestName={guest.guestName}
            roomNumber={guest.roomNumber}
            leavingDate={formatDate(guest.checkOutDate)}
            dayRemaining={guest.dayRemaining}
            buttonText="Check in"
            buttonColor="blue"
            onButtonClick={() => onCheckIn(guest.id)}
            className="first:pt-0"
          />
        ))}
      </div>
    </div>
  );
};

export default CheckInSection;