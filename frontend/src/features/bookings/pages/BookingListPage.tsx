import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../../../store';
import { 
  fetchBookings, 
  setCurrentPage, 
  setSearchTerm, 
  setStatusFilter,
  clearError
} from '../../../store/bookingSlice';
import BookingTable from '../components/BookingTable';
import Pagination from '../../../components/Pagination';
import type { Booking, BookingStatus } from '../types';
import { BookingStatusDisplay } from '../types';

const BookingListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    bookings,
    loading,
    error,
    currentPage,
    pageSize,
    sortBy,
    sortDirection,
    searchTerm,
    statusFilter,
  } = useSelector((state: RootState) => state.bookings);

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || '');

  useEffect(() => {
    loadBookings();
  }, [currentPage, pageSize, sortBy, sortDirection, searchTerm, statusFilter]);

  const loadBookings = () => {
    dispatch(fetchBookings({
      page: currentPage,
      size: pageSize,
      sortBy,
      sortDirection,
      filters: {
        search: searchTerm,
        status: statusFilter as BookingStatus,
      },
    }));
  };

  const handleSearchChange = (value: string) => {
    setLocalSearchTerm(value);
    dispatch(setSearchTerm(value));
    dispatch(setCurrentPage(1)); // Reset to first page when searching
  };

  const handleSearchClear = () => {
    setLocalSearchTerm('');
    dispatch(setSearchTerm(''));
    dispatch(setCurrentPage(1));
  };

  const handleStatusFilterChange = (status: string) => {
    dispatch(setStatusFilter(status));
    dispatch(setCurrentPage(1)); // Reset to first page when filtering
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
  };

  const handleDetailClick = (booking: Booking) => {
    navigate(`/bookings/${booking.id}`);
  };

  const handleNewBooking = () => {
    navigate('/bookings/new');
  };

  const handleRefresh = () => {
    dispatch(clearError());
    loadBookings();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Booking List</h1>
              <p className="mt-2 text-sm text-gray-600">
                Manage and view all hotel bookings
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button
                onClick={handleNewBooking}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                New Booking
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="flex">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={localSearchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search"
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {localSearchTerm && (
                    <button
                      type="button"
                      onClick={handleSearchClear}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Show All</option>
                {Object.entries(BookingStatusDisplay).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading bookings</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleRefresh}
                    className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Table */}
        <BookingTable
          bookings={bookings?.content || []}
          loading={loading}
          onDetailClick={handleDetailClick}
          className="mb-6"
        />

        {/* Pagination */}
        {bookings && (
          <Pagination
            currentPage={currentPage}
            totalPages={bookings.totalPages}
            totalElements={bookings.totalElements}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default BookingListPage;