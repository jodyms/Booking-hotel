import React from 'react';

interface GuestCardProps {
  guestName: string;
  roomNumber: string;
  leavingDate: string;
  dayRemaining: number;
  buttonText: string;
  buttonColor?: 'blue' | 'green';
  onButtonClick: () => void;
  className?: string;
}

const GuestCard: React.FC<GuestCardProps> = ({
  guestName,
  roomNumber,
  leavingDate,
  dayRemaining,
  buttonText,
  buttonColor = 'blue',
  onButtonClick,
  className = ''
}) => {
  const buttonColorClasses = {
    blue: 'bg-blue-600 hover:bg-blue-700 border-blue-600',
    green: 'bg-green-600 hover:bg-green-700 border-green-600'
  };

  return (
    <div className={`flex items-center justify-between py-4 px-0 ${className}`}>
      <div className="flex-1">
        <h3 className="text-base font-semibold text-gray-900 mb-1">
          {guestName}
        </h3>
        <p className="text-sm text-gray-600">
          Leaving {leavingDate} (in {dayRemaining} days)
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-lg font-bold text-gray-900 min-w-[3rem] text-center">
          {roomNumber}
        </span>
        
        <button
          onClick={onButtonClick}
          className={`px-4 py-2 text-white text-sm font-medium rounded-md border transition-colors ${buttonColorClasses[buttonColor]}`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default GuestCard;