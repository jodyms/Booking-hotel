import React from 'react';
import type { BookingFormData, GuestInfoFormProps } from '../types';

const GuestInfoForm: React.FC<GuestInfoFormProps> = ({
  formData,
  onChange,
  errors = {},
  disabled = false,
}) => {
  const handleChange = (field: keyof BookingFormData, value: string | number) => {
    onChange({ [field]: value });
  };

  const pronounOptions = [
    { value: 'Mr', label: 'Mr' },
    { value: 'Mrs', label: 'Mrs' },
    { value: 'Ms', label: 'Ms' },
    { value: 'Dr', label: 'Dr' },
    { value: 'Prof', label: 'Prof' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Guest Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              disabled={disabled}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.firstName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter First Name"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              disabled={disabled}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.lastName ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter Last Name"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
            )}
          </div>

          {/* Pronouns */}
          <div>
            <label htmlFor="pronouns" className="block text-sm font-medium text-gray-700">
              Pronouns
            </label>
            <select
              id="pronouns"
              name="pronouns"
              value={formData.pronouns}
              onChange={(e) => handleChange('pronouns', e.target.value)}
              disabled={disabled}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.pronouns ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              {pronounOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.pronouns && (
              <p className="mt-1 text-sm text-red-600">{errors.pronouns}</p>
            )}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Stay Details</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Check-in Date */}
          <div>
            <label htmlFor="checkInDate" className="block text-sm font-medium text-gray-700">
              Check In Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="checkInDate"
              name="checkInDate"
              required
              value={formData.checkInDate}
              onChange={(e) => handleChange('checkInDate', e.target.value)}
              disabled={disabled}
              min={new Date().toISOString().split('T')[0]} // Prevent past dates
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.checkInDate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.checkInDate && (
              <p className="mt-1 text-sm text-red-600">{errors.checkInDate}</p>
            )}
          </div>

          {/* Check-out Date */}
          <div>
            <label htmlFor="checkOutDate" className="block text-sm font-medium text-gray-700">
              Check Out Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="checkOutDate"
              name="checkOutDate"
              required
              value={formData.checkOutDate}
              onChange={(e) => handleChange('checkOutDate', e.target.value)}
              disabled={disabled}
              min={formData.checkInDate || new Date().toISOString().split('T')[0]}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.checkOutDate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.checkOutDate && (
              <p className="mt-1 text-sm text-red-600">{errors.checkOutDate}</p>
            )}
          </div>

          {/* Adult Capacity */}
          <div>
            <label htmlFor="adultCapacity" className="block text-sm font-medium text-gray-700">
              Adult Capacity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="adultCapacity"
              name="adultCapacity"
              required
              min="1"
              max="10"
              value={formData.adultCapacity}
              onChange={(e) => handleChange('adultCapacity', parseInt(e.target.value) || 1)}
              disabled={disabled}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.adultCapacity ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter Adult Capacity (e.g. 2)"
            />
            {errors.adultCapacity && (
              <p className="mt-1 text-sm text-red-600">{errors.adultCapacity}</p>
            )}
          </div>

          {/* Children Capacity */}
          <div>
            <label htmlFor="childrenCapacity" className="block text-sm font-medium text-gray-700">
              Children Capacity
            </label>
            <input
              type="number"
              id="childrenCapacity"
              name="childrenCapacity"
              min="0"
              max="10"
              value={formData.childrenCapacity}
              onChange={(e) => handleChange('childrenCapacity', parseInt(e.target.value) || 0)}
              disabled={disabled}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
                errors.childrenCapacity ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter Children Capacity (e.g. 1)"
            />
            {errors.childrenCapacity && (
              <p className="mt-1 text-sm text-red-600">{errors.childrenCapacity}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestInfoForm;