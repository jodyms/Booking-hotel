import React from 'react';
import type { Room } from '../../../types/room';

interface RoomSelectionCardProps {
  room: Room;
  isSelected?: boolean;
  numberOfNights: number;
  totalAmount: number;
  onSelect: (room: Room) => void;
  disabled?: boolean;
}

const RoomSelectionCard: React.FC<RoomSelectionCardProps> = ({
  room,
  isSelected = false,
  numberOfNights,
  totalAmount,
  onSelect,
  disabled = false,
}) => {
  const handleSelect = () => {
    if (!disabled) {
      onSelect(room);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div
      className={`relative rounded-lg border p-6 cursor-pointer transition-all hover:shadow-md ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : disabled
          ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
          : 'border-gray-300 bg-white hover:border-gray-400'
      }`}
      onClick={handleSelect}
    >
      {isSelected && (
        <div className="absolute -top-2 -right-2">
          <div className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Room Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-blue-600">{room.roomNumber}</h3>
            <p className="text-sm text-gray-500 mt-1">Room Number</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(room.price)}
            </p>
            <p className="text-sm text-gray-500">per Night</p>
          </div>
        </div>

        {/* Room Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="text-sm text-gray-600">
              {room.adultCapacity} Adult{room.adultCapacity > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275"
              />
            </svg>
            <span className="text-sm text-gray-600">
              {room.childrenCapacity} Child{room.childrenCapacity !== 1 ? 'ren' : ''}
            </span>
          </div>
        </div>

        {/* Amenities (if available) */}
        {room.amenities && room.amenities.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Amenities:</p>
            <div className="flex flex-wrap gap-2">
              {room.amenities.slice(0, 3).map((amenity) => (
                <span
                  key={amenity.id}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {amenity.name}
                </span>
              ))}
              {room.amenities.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{room.amenities.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Pricing Summary */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {formatCurrency(room.price)} × {numberOfNights} night{numberOfNights > 1 ? 's' : ''}
            </span>
            <span className="font-medium text-gray-900">
              {formatCurrency(totalAmount)}
            </span>
          </div>
          <div className="flex justify-between text-base font-bold">
            <span>Total Amount</span>
            <span className="text-blue-600">{formatCurrency(totalAmount)}</span>
          </div>
        </div>

        {/* Selection Indicator */}
        <div className="flex items-center justify-center">
          <div className={`flex items-center space-x-2 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
            <div
              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
              }`}
            >
              {isSelected && (
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium">
              {isSelected ? 'Selected' : 'Select Room'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomSelectionCard;