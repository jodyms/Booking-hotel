import React from 'react';
import type { Booking, BookingTableProps } from '../types';
import { BookingStatusColors, BookingStatusDisplay } from '../types';

const BookingTable: React.FC<BookingTableProps> = ({
  bookings,
  loading = false,
  onDetailClick,
  className = '',
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString || dateString === '-') return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const handleDetailClick = (booking: Booking) => {
    if (onDetailClick) {
      onDetailClick(booking);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white shadow-sm rounded-lg ${className}`}>
        <div className="animate-pulse p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="grid grid-cols-6 gap-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className={`bg-white shadow-sm rounded-lg ${className}`}>
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
          <p className="mt-1 text-sm text-gray-500">
            No bookings match your current search criteria.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white shadow-sm rounded-lg overflow-hidden ${className}`}>
      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Guest
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Room
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Check In
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Check Out
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {booking.pronouns} {booking.firstName} {booking.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{booking.roomNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(booking.checkInDate)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatDate(booking.checkOutDate)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      BookingStatusColors[booking.status]
                    }`}
                  >
                    {BookingStatusDisplay[booking.status]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDetailClick(booking)}
                    className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-gray-200">
        {bookings.map((booking) => (
          <div key={booking.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-900">
                {booking.pronouns} {booking.firstName} {booking.lastName}
              </h3>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  BookingStatusColors[booking.status]
                }`}
              >
                {BookingStatusDisplay[booking.status]}
              </span>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Room:</span>
                <span className="font-medium">{booking.roomNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Check In:</span>
                <span>{formatDate(booking.checkInDate)}</span>
              </div>
              <div className="flex justify-between">
                <span>Check Out:</span>
                <span>{formatDate(booking.checkOutDate)}</span>
              </div>
            </div>
            <div className="mt-3 text-right">
              <button
                onClick={() => handleDetailClick(booking)}
                className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Detail
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingTable;