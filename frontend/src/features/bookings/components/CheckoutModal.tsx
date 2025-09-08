import React from 'react';
import type { Booking, CheckoutSummary } from '../../../types/booking';

interface CheckoutModalProps {
  isOpen: boolean;
  booking: Booking | null;
  checkoutSummary: CheckoutSummary | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  booking,
  checkoutSummary,
  loading,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !booking) return null;

  const formatDate = (dateString: string) => {
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

  const formatCurrency = (amount: number) => {
    return `$ ${amount.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
  };

  // Handle ESC key
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscKey);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  return (
    <div 
      className="fixed inset-0 bg-opacity-20 backdrop-blur-xs flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gray-200 px-6 py-4 rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-800">Checkout Confirmation</h2>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Room and Guest Info */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Room {booking.roomNumber}</h3>
            <p className="text-gray-600">{booking.pronouns} {booking.firstName} {booking.lastName}</p>
          </div>

          {/* Check-in/out Dates */}
          <div className="grid grid-cols-2 gap-6 mb-6 pb-6 border-b border-gray-200">
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Checked in on</h4>
              <p className="text-gray-600">{formatDate(booking.checkInDate)}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Checking out on</h4>
              <p className="text-gray-600">{formatDate(checkoutSummary?.checkOutDate || new Date().toISOString())}</p>
            </div>
          </div>

          {/* Billing Summary */}
          <div className="space-y-3 mb-6">
            {/* Room Total */}
            <div className="flex justify-between items-center">
              <span className="text-gray-700">
                Room Total ({checkoutSummary?.totalNights || 0} Nights)
              </span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(checkoutSummary?.roomTotal || booking.totalAmount)}
              </span>
            </div>

            {/* Service Charges */}
            {checkoutSummary?.serviceCharges?.map((service, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700">{service.name}</span>
                <span className="font-semibold text-gray-900">{formatCurrency(service.amount)}</span>
              </div>
            ))}

            {/* Divider */}
            <hr className="border-gray-300" />

            {/* Grand Total */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold text-gray-900">Grand Total</span>
              <span className="text-lg font-bold text-blue-600">
                {formatCurrency(checkoutSummary?.grandTotal || booking.totalAmount)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirm
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;