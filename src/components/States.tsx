import React from 'react';
import { GRID_COLS } from './VirtualizedTable';

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
    <div className="space-y-6 animate-in">
      {/* Skeleton filter bar */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-wrap gap-3">
          {[180, 140, 120, 160, 80].map((w, i) => (
            <div key={i} className="space-y-2" style={{ minWidth: w }}>
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
              <div className="h-9 bg-gray-100 rounded-lg animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
            </div>
          ))}
        </div>
      </div>

      {/* Skeleton count bar */}
      <div className="flex items-center justify-between">
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="h-9 w-28 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* Skeleton table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Header shimmer */}
        <div
          className="bg-gray-50 border-b-2 border-gray-200 grid"
          style={{ gridTemplateColumns: GRID_COLS }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="px-3 py-3">
              <div
                className="h-3 bg-gray-200 rounded animate-pulse"
                style={{ width: `${50 + (i % 3) * 15}%`, animationDelay: `${i * 80}ms` }}
              />
            </div>
          ))}
        </div>

        {/* Row skeletons with carousel shimmer */}
        {Array.from({ length: 10 }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="grid border-b border-gray-100"
            style={{ gridTemplateColumns: GRID_COLS }}
          >
            {Array.from({ length: 10 }).map((_, colIdx) => (
              <div key={colIdx} className="px-3 py-3.5">
                <div
                  className="h-3.5 rounded skeleton-shimmer"
                  style={{
                    width: colIdx === 1 ? '85%' : colIdx === 6 ? '60%' : '70%',
                    animationDelay: `${rowIdx * 120 + colIdx * 60}ms`,
                  }}
                />
              </div>
            ))}
          </div>
        ))}

        {/* Skeleton pagination */}
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-7 w-8 bg-gray-200 rounded animate-pulse"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Loading text */}
      <div className="text-center">
        <p className="text-sm text-gray-500">Loading 10,000+ users...</p>
      </div>
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
