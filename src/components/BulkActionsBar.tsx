import React, { useCallback } from 'react';
import { useStore } from '../store';

export const BulkActionsBar = React.memo(() => {
  const selectedIds = useStore((state) => state.selectedIds);
  const deleteUsers = useStore((state) => state.deleteUsers);
  const clearSelection = useStore((state) => state.clearSelection);

  const count = selectedIds.size;

  const handleBulkDelete = useCallback(() => {
    if (count === 0) return;
    if (window.confirm(`Are you sure you want to delete ${count} user(s)? This cannot be undone.`)) {
      deleteUsers(Array.from(selectedIds));
    }
  }, [selectedIds, count, deleteUsers]);

  if (count === 0) return null;

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-4 flex items-center justify-between animate-in">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full">
          {count}
        </span>
        <span className="text-sm font-medium text-blue-800">
          user{count !== 1 ? 's' : ''} selected
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleBulkDelete}
          className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Delete Selected
        </button>
        <button
          onClick={clearSelection}
          className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
      </div>
    </div>
  );
});

BulkActionsBar.displayName = 'BulkActionsBar';
