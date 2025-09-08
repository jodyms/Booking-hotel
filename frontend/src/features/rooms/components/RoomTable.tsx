import React from 'react';
import type { Room, RoomListResponse, RoomTableProps } from '../types';

const RoomTable: React.FC<RoomTableProps> = ({
  data,
  loading,
  onSort,
  sortField,
  sortDirection,
  onPageChange,
  onDetailClick
}) => {
  const TableSkeleton = () => (
    <div className="animate-pulse">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 bg-gray-300 rounded w-32"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 bg-gray-300 rounded w-36"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[...Array(8)].map((_, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-8"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-8"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) {
      return <span className="ml-1 text-gray-400">↕</span>;
    }
    return sortDirection === 'asc' ? 
      <span className="ml-1 text-blue-500">↑</span> : 
      <span className="ml-1 text-blue-500">↓</span>;
  };

  const renderPagination = () => {
    if (!data || data.totalPages <= 1) return null;

    const currentPage = data.number + 1; // Convert from 0-based to 1-based
    const totalPages = data.totalPages;
    const pages = [];

    // Always show first page
    if (currentPage > 2) {
      pages.push(1);
      if (currentPage > 3) {
        pages.push('...');
      }
    }

    // Show pages around current page
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      pages.push(i);
    }

    // Always show last page
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return (
      <div className="flex items-center justify-between border-t border-gray-200 px-6 py-3">
        <div className="flex flex-1 justify-between sm:hidden">
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              currentPage <= 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className={`relative ml-3 inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
              currentPage >= totalPages
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing {data.number * data.size + 1} to {Math.min((data.number + 1) * data.size, data.totalElements)} of {data.totalElements} results
            </p>
          </div>
          <div>
            <nav className="flex items-center space-x-1" aria-label="Pagination">
              {pages.map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-sm text-gray-700">
                      ...
                    </span>
                  ) : (
                    <button
                      onClick={() => onPageChange(page as number)}
                      className={`px-3 py-2 text-sm font-medium rounded ${
                        page === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}

              <button
                onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={`ml-2 px-3 py-2 text-sm font-medium rounded ${
                  currentPage >= totalPages
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <TableSkeleton />;
  }

  if (!data || !data.content.length) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No rooms found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('roomNumber')}
              >
                <div className="flex items-center">
                  Room Number
                  <SortIcon field="roomNumber" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('adultCapacity')}
              >
                <div className="flex items-center">
                  Adult Capacity
                  <SortIcon field="adultCapacity" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('childrenCapacity')}
              >
                <div className="flex items-center">
                  Children Capacity
                  <SortIcon field="childrenCapacity" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => onSort('price')}
              >
                <div className="flex items-center">
                  Price
                  <SortIcon field="price" />
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.content.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {room.roomNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {room.adultCapacity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {room.childrenCapacity}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${room.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => onDetailClick(room)}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                    </svg>
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  );
};

export default RoomTable;