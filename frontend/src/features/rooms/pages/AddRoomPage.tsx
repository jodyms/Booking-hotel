import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomForm from '../components/RoomForm';
import type { CreateRoomRequest, UpdateRoomRequest, Room } from '../../../types/room';
import { roomService } from '../services/roomService';

const AddRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (roomData: CreateRoomRequest | UpdateRoomRequest | Room) => {
    try {
      setLoading(true);
      setError(null);
      
      // Type guard to ensure we're working with CreateRoomRequest for this page
      if ('roomNumber' in roomData && typeof roomData.roomNumber === 'string') {
        await roomService.createRoom(roomData as CreateRoomRequest);
      } else {
        throw new Error('Invalid room data format');
      }
      
      // Show success message
      alert('Room created successfully!');
      
      // Navigate back to rooms list
      navigate('/rooms');
    } catch (error) {
      console.error('Error creating room:', error);
      
      // Extract error message
      let errorMessage = 'An error occurred while creating the room';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        if (axiosError.response?.data?.message) {
          errorMessage = axiosError.response.data.message;
        }
      } else if (error instanceof Error && error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/rooms');
  };

  return (
    <div className="flex-1 p-8 bg-gray-50">
      {/* Navigation Breadcrumb */}
      <nav className="mb-4">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <span className="text-gray-400">Home</span>
          </li>
          <li>
            <svg className="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </li>
          <li>
            <button
              onClick={() => navigate('/rooms')}
              className="text-gray-400 hover:text-gray-600"
            >
              Rooms
            </button>
          </li>
          <li>
            <svg className="h-4 w-4 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </li>
          <li>
            <span className="text-gray-600 font-medium">New Room</span>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Room</h1>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 border border-red-300 rounded-md bg-red-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form Container - sesuai dengan gambar */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <RoomForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default AddRoomPage;