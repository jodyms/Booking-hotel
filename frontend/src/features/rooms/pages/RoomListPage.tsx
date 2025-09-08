import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import RoomTable from '../components/RoomTable';
import type { Room, RoomListResponse, RoomPaginationParams } from '../types';

const RoomListPage: React.FC = () => {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<RoomPaginationParams>({
    page: 1,
    size: 10,
    sortBy: 'roomNumber',
    sortDirection: 'asc',
  });

  const fetchRooms = useCallback(async (params: RoomPaginationParams) => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams({
        page: (params.page - 1).toString(), // Backend uses 0-based indexing
        size: params.size.toString(),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.sortDirection && { sortDirection: params.sortDirection }),
        ...(searchTerm && { search: searchTerm }),
      });

      const response = await fetch(`http://localhost:8080/api/rooms?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRooms(data);
      } else {
        console.error('Failed to fetch rooms');
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchRooms(pagination);
  }, [pagination, fetchRooms]);

  const handleSort = (field: string) => {
    setPagination(prev => ({
      ...prev,
      sortBy: field,
      sortDirection: prev.sortBy === field && prev.sortDirection === 'asc' ? 'desc' : 'asc',
      page: 1, // Reset to first page when sorting
    }));
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({
      ...prev,
      page,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({
      ...prev,
      page: 1, // Reset to first page when searching
    }));
    fetchRooms({ ...pagination, page: 1 });
  };

  const handleDetailClick = (room: Room) => {
    console.log('Room detail clicked:', room);
    navigate(`/rooms/edit/${room.id}`);
  };

  const handleAddRoom = () => {
    navigate('/rooms/add');
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
            <span className="text-gray-600 font-medium">Rooms</span>
          </li>
        </ol>
      </nav>

      {/* Header dengan Room List title dan Add Room button */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Room List</h1>
        <button
          onClick={handleAddRoom}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add Room
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
            </svg>
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Search"
          />
        </form>
      </div>

      {/* Table Card Container - sesuai dengan gambar */}
      <div className="bg-white rounded-lg shadow">
        <RoomTable
          data={rooms}
          loading={loading}
          onSort={handleSort}
          sortField={pagination.sortBy}
          sortDirection={pagination.sortDirection}
          onPageChange={handlePageChange}
          onDetailClick={handleDetailClick}
        />
      </div>
    </div>
  );
};

export default RoomListPage;