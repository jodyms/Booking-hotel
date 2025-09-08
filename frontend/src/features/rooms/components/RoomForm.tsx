import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreateRoomRequest, Room, UpdateRoomRequest } from '../../../types/room';
import type { Amenity } from '../../../types/amenity';
import { amenityService } from '../../../services/amenityService';
import { roomService } from '../services/roomService';

interface RoomFormProps {
  onSubmit?: (room: CreateRoomRequest | UpdateRoomRequest | Room) => void;
  onCancel?: () => void;
  loading?: boolean;
  initialRoom?: Room;
  isEditMode?: boolean;
}

const RoomForm: React.FC<RoomFormProps> = ({ onSubmit, onCancel, loading = false, initialRoom, isEditMode = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateRoomRequest>({
    roomNumber: initialRoom?.roomNumber || '',
    adultCapacity: initialRoom?.adultCapacity || 1,
    childrenCapacity: initialRoom?.childrenCapacity || 0,
    price: initialRoom?.price || 0,
    amenityIds: initialRoom?.amenities?.map(a => a.id) || [],
  });

  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [selectedAmenity, setSelectedAmenity] = useState<number | ''>('');
  const [addedAmenities, setAddedAmenities] = useState<Amenity[]>(initialRoom?.amenities || []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAmenities();
  }, []);

  // Initialize form data when initialRoom becomes available
  useEffect(() => {
    if (initialRoom) {
      const initialAmenityIds = initialRoom.amenities?.map(a => a.id) || [];
      setFormData({
        roomNumber: initialRoom.roomNumber,
        adultCapacity: initialRoom.adultCapacity,
        childrenCapacity: initialRoom.childrenCapacity,
        price: initialRoom.price,
        amenityIds: initialAmenityIds,
      });
      setAddedAmenities(initialRoom.amenities || []);
      console.log('Initialized room data:', {
        roomId: initialRoom.id,
        roomNumber: initialRoom.roomNumber,
        amenities: initialRoom.amenities,
        amenityIds: initialAmenityIds
      });
    }
  }, [initialRoom]);

  const fetchAmenities = async () => {
    try {
      const data = await amenityService.getAllActiveAmenities();
      console.log('Amenities fetched:', data);
      console.log('Number of amenities:', data.length);
      setAmenities(data);
    } catch (error: unknown) {
      console.error('Error fetching amenities:', error);
      const errorDetails = (error as { response?: { data?: unknown }; message?: string })?.response?.data || (error as { message?: string })?.message;
      console.error('Error details:', errorDetails);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.roomNumber.trim()) {
      newErrors.roomNumber = 'Room number is required';
    } else if (formData.roomNumber.length > 10) {
      newErrors.roomNumber = 'Room number must be less than 10 characters';
    }

    if (!formData.adultCapacity || formData.adultCapacity < 1) {
      newErrors.adultCapacity = 'Adult capacity must be at least 1';
    }

    if (formData.childrenCapacity < 0) {
      newErrors.childrenCapacity = 'Children capacity cannot be negative';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CreateRoomRequest, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddAmenity = () => {
    if (selectedAmenity && String(selectedAmenity) !== '') {
      const amenityId = typeof selectedAmenity === 'number' ? selectedAmenity : parseInt(String(selectedAmenity));
      const amenity = amenities.find(a => a.id === amenityId);
      if (amenity && !addedAmenities.some(a => a.id === amenity.id)) {
        const newAddedAmenities = [...addedAmenities, amenity];
        const newAmenityIds = newAddedAmenities.map(a => a.id);
        setAddedAmenities(newAddedAmenities);
        setFormData(prev => ({
          ...prev,
          amenityIds: newAmenityIds
        }));
        setSelectedAmenity('');
        console.log('Added amenity:', amenity.name, 'New amenityIds:', newAmenityIds);
      }
    }
  };

  const handleRemoveAmenity = (amenityId: number) => {
    const newAddedAmenities = addedAmenities.filter(a => a.id !== amenityId);
    const newAmenityIds = newAddedAmenities.map(a => a.id);
    setAddedAmenities(newAddedAmenities);
    setFormData(prev => ({
      ...prev,
      amenityIds: newAmenityIds
    }));
    console.log('Removed amenity ID:', amenityId, 'New amenityIds:', newAmenityIds);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    console.log('RoomForm: Starting form submission');
    console.log('RoomForm: Current formData before submit:', formData);
    console.log('RoomForm: Current addedAmenities:', addedAmenities);

    try {
      setSubmitting(true);
      
      if (onSubmit) {
        console.log('RoomForm: Using onSubmit callback');
        
        if (isEditMode && initialRoom) {
          // For edit mode, prepare Room object with amenities
          const selectedAmenityObjects = addedAmenities.map(amenity => ({
            id: amenity.id,
            name: amenity.name,
            description: amenity.description,
            isActive: amenity.isActive
          }));
          
          const roomUpdateData = {
            id: initialRoom.id,
            roomNumber: formData.roomNumber,
            adultCapacity: formData.adultCapacity,
            childrenCapacity: formData.childrenCapacity,
            price: formData.price,
            amenities: selectedAmenityObjects,
            createdAt: initialRoom.createdAt,
            updatedAt: initialRoom.updatedAt
          };
          
          console.log('RoomForm: Sending Room object via callback:', roomUpdateData);
          await onSubmit(roomUpdateData);
        } else {
          // For create mode, use formData as is
          console.log('RoomForm: Sending CreateRoomRequest via callback:', formData);
          await onSubmit(formData);
        }
        console.log('RoomForm: onSubmit callback completed successfully');
      } else {
        // Default submission behavior
        if (isEditMode && initialRoom) {
          console.log('Updating room with data:', formData);
          console.log('Room ID:', initialRoom.id);
          
          // Convert amenityIds to amenities objects for backend
          const selectedAmenityObjects = addedAmenities.map(amenity => ({
            id: amenity.id,
            name: amenity.name,
            description: amenity.description,
            isActive: amenity.isActive
          }));
          
          const roomUpdateData = {
            id: initialRoom.id,
            roomNumber: formData.roomNumber,
            adultCapacity: formData.adultCapacity,
            childrenCapacity: formData.childrenCapacity,
            price: formData.price,
            amenities: selectedAmenityObjects,
            createdAt: initialRoom.createdAt,
            updatedAt: initialRoom.updatedAt
          };
          
          console.log('Sending room update with amenities:', roomUpdateData);
          await roomService.updateRoom(initialRoom.id, roomUpdateData);
          alert('Room updated successfully!');
        } else {
          console.log('Creating room with data:', formData);
          await roomService.createRoom(formData);
          alert('Room created successfully!');
        }
        navigate('/rooms');
      }
    } catch (error: unknown) {
      console.error('Error creating room:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error creating room';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/rooms');
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Room Number */}
          <div>
            <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Room Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="roomNumber"
              value={formData.roomNumber}
              onChange={(e) => handleInputChange('roomNumber', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.roomNumber ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter Room Number"
              disabled={loading || submitting}
            />
            {errors.roomNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.roomNumber}</p>
            )}
          </div>

          {/* Adult Capacity */}
          <div>
            <label htmlFor="adultCapacity" className="block text-sm font-medium text-gray-700 mb-2">
              Adult Capacity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="adultCapacity"
              value={formData.adultCapacity}
              onChange={(e) => handleInputChange('adultCapacity', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.adultCapacity ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter Adult Capacity (e.g. 2)"
              min="1"
              disabled={loading || submitting}
            />
            {errors.adultCapacity && (
              <p className="mt-1 text-sm text-red-500">{errors.adultCapacity}</p>
            )}
          </div>

          {/* Children Capacity */}
          <div>
            <label htmlFor="childrenCapacity" className="block text-sm font-medium text-gray-700 mb-2">
              Children Capacity
            </label>
            <input
              type="number"
              id="childrenCapacity"
              value={formData.childrenCapacity}
              onChange={(e) => handleInputChange('childrenCapacity', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.childrenCapacity ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter Children Capacity (e.g. 1)"
              min="0"
              disabled={loading || submitting}
            />
            {errors.childrenCapacity && (
              <p className="mt-1 text-sm text-red-500">{errors.childrenCapacity}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
              Price <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter Price (e.g. 50)"
              min="0"
              step="0.01"
              disabled={loading || submitting}
            />
            {errors.price && (
              <p className="mt-1 text-sm text-red-500">{errors.price}</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Amenities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amenities
            </label>
            
            {/* Dropdown and Add Button */}
            <div className="flex space-x-2">
              <select
                value={selectedAmenity}
                onChange={(e) => setSelectedAmenity(e.target.value === '' ? '' : parseInt(e.target.value))}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading || submitting}
              >
                <option value="">Select an amenity</option>
                {amenities
                  .filter(amenity => !addedAmenities.some(added => added.id === amenity.id))
                  .map((amenity) => (
                    <option key={amenity.id} value={amenity.id}>
                      {amenity.name}{amenity.description && ` - ${amenity.description}`}
                    </option>
                  ))}
              </select>
              
              <button
                type="button"
                onClick={handleAddAmenity}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || submitting || selectedAmenity === ''}
              >
                Add Amenity
              </button>
            </div>

            {/* Added Amenities List */}
            {addedAmenities.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Amenities:</h4>
                <div className="space-y-2">
                  {addedAmenities.map((amenity) => (
                    <div key={amenity.id} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                      <span className="text-sm text-gray-900">
                        {amenity.name}
                        {amenity.description && (
                          <span className="text-gray-500 ml-1">- {amenity.description}</span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(amenity.id)}
                        className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                        disabled={loading || submitting}
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center space-x-4 pt-6">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || submitting}
        >
          Back
        </button>
        <button
          type="submit"
          className="px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || submitting}
        >
          {submitting ? 'Saving...' : (isEditMode ? 'Update' : 'Save')}
        </button>
      </div>
    </form>
  );
};

export default RoomForm;