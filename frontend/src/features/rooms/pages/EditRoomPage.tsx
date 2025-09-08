import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RoomForm from '../components/RoomForm';
import type { Room, UpdateRoomRequest } from '../../../types/room';
import { roomService } from '../services/roomService';

const EditRoomPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchRoom(parseInt(id));
    }
  }, [id]);

  const fetchRoom = async (roomId: number) => {
    try {
      setFetchLoading(true);
      setError(null);
      const roomData = await roomService.getRoomById(roomId);
      setRoom(roomData);
    } catch (error: unknown) {
      console.error('Error fetching room:', error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error fetching room data';
      setError(errorMessage);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (roomData: UpdateRoomRequest | Room) => {
    if (!room) return;
    
    try {
      setLoading(true);
      setError(null);
      
      console.log('EditRoomPage: Submitting room data:', {
        roomId: room.id,
        roomData: roomData,
        amenities: 'amenities' in roomData ? roomData.amenities : (roomData as UpdateRoomRequest).amenityIds
      });
      
      await roomService.updateRoom(room.id, roomData);
      
      alert('Room updated successfully!');
      navigate('/rooms');
    } catch (error: unknown) {
      console.error('Error updating room:', error);
      
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Error updating room';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/rooms');
  };

  if (fetchLoading) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Loading room data...</p>
        </div>
      </div>
    );
  }

  if (error && !room) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => navigate('/rooms')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex-1 p-8 bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">Room not found</p>
          <button
            onClick={() => navigate('/rooms')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    );
  }

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
            <span className="text-gray-600 font-medium">Edit Room {room.roomNumber}</span>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Room {room.roomNumber}</h1>
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

      {/* Form Container */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <RoomForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
            initialRoom={room}
            isEditMode={true}
          />
        </div>
      </div>
    </div>
  );
};

export default EditRoomPage;