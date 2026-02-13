import React from 'react';

interface ErrorNotificationProps {
  message: string;
  onDismiss: () => void;
}

export const ErrorNotification = React.memo(({ message, onDismiss }: ErrorNotificationProps) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <p className="ml-3 text-sm font-medium text-red-800">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-red-400 hover:text-red-600"
      >
        ×
      </button>
    </div>
  );
});

ErrorNotification.displayName = 'ErrorNotification';

export const LoadingState = React.memo(() => {
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-600 font-medium">Loading users...</p>
      <p className="text-gray-400 text-sm mt-2">This may take a moment with 10,000+ users</p>
    </div>
  );
});

LoadingState.displayName = 'LoadingState';

export const EmptyState = React.memo(() => {
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <svg
        className="h-16 w-16 text-gray-400 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <p className="text-gray-600 font-medium">No users found</p>
      <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search query</p>
    </div>
  );
});

EmptyState.displayName = 'EmptyState';
