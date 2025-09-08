import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { createRoomService, clearErrors, clearCreateSuccess } from '../../../store/roomServiceSlice';
import RoomServiceForm from './RoomServiceForm';
import type { CreateRoomServiceRequest, RoomServiceModalProps } from '../types';

const RoomServiceModal: React.FC<RoomServiceModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { createLoading, createError, createSuccess } = useAppSelector(state => state.roomService);

  useEffect(() => {
    if (createSuccess) {
      // Show success notification briefly then close modal
      setTimeout(() => {
        dispatch(clearCreateSuccess());
        onClose();
      }, 1500);
    }
  }, [createSuccess, dispatch, onClose]);

  useEffect(() => {
    if (isOpen) {
      // Clear any previous errors when modal opens
      dispatch(clearErrors());
    }
  }, [isOpen, dispatch]);

  const handleSubmit = (data: CreateRoomServiceRequest) => {
    dispatch(createRoomService(data));
  };

  const handleClose = () => {
    dispatch(clearErrors());
    dispatch(clearCreateSuccess());
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 backdrop-blur-md bg-white/10 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Room Service</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {createSuccess ? (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Request Submitted Successfully!</h3>
              <p className="text-sm text-gray-600">Your room service request has been created and will be processed shortly.</p>
            </div>
          ) : (
            <RoomServiceForm
              onSubmit={handleSubmit}
              loading={createLoading}
              error={createError}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomServiceModal;