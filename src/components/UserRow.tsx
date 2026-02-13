import React, { useCallback } from 'react';
import type { User } from '../types';
import { formatCurrency } from '../utils';
import { useStore } from '../store';
import { GRID_COLS } from './VirtualizedTable';

interface UserRowProps {
  user: User;
  onRowClick: (user: User) => void;
  isOptimisticUpdate: boolean;
  isEven: boolean;
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  editor: 'bg-blue-100 text-blue-700',
  viewer: 'bg-gray-100 text-gray-600',
};

export const UserRow = React.memo(
  ({ user, onRowClick, isOptimisticUpdate, isEven }: UserRowProps) => {
    const selectedIds = useStore((state) => state.selectedIds);
    const toggleSelectUser = useStore((state) => state.toggleSelectUser);
    const togglePinUser = useStore((state) => state.togglePinUser);
    const deleteUser = useStore((state) => state.deleteUser);

    const isSelected = selectedIds.has(user.id);

    const handleCheckbox = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleSelectUser(user.id);
      },
      [user.id, toggleSelectUser]
    );

    const handlePin = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        togglePinUser(user.id);
      },
      [user.id, togglePinUser]
    );

    const handleDelete = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`Delete ${user.name}?`)) {
          deleteUser(user.id);
        }
      },
      [user.id, user.name, deleteUser]
    );

    const statusColor =
      user.status === 'active'
        ? 'bg-green-100 text-green-700'
        : 'bg-red-100 text-red-700';
    const optimisticClass = isOptimisticUpdate ? 'opacity-70' : '';
    const bgClass = user.isPinned
      ? 'bg-yellow-50/80'
      : isSelected
        ? 'bg-blue-50'
        : isEven
          ? 'bg-white'
          : 'bg-gray-50/60';

    return (
      <div
        onClick={() => onRowClick(user)}
        className={`grid items-center h-full border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors ${optimisticClass} ${bgClass}`}
        style={{ gridTemplateColumns: GRID_COLS }}
      >
        {/* Checkbox */}
        <div className="px-2 py-2 flex items-center justify-center">
          <input
            type="checkbox"
            checked={isSelected}
            onClick={handleCheckbox}
            onChange={() => {}}
            className="w-4 h-4 text-blue-600 rounded border-gray-300 cursor-pointer"
          />
        </div>
        <div className="px-3 py-2 text-sm font-medium text-gray-900 truncate flex items-center gap-1">
          {user.isPinned && <span className="text-yellow-500 text-xs" title="Pinned">📌</span>}
          {user.name}
        </div>
        <div className="px-3 py-2 text-sm text-gray-500 truncate">
          {user.email}
        </div>
        <div className="px-3 py-2 text-sm text-gray-600 text-center">
          {user.age}
        </div>
        <div className="px-3 py-2 text-sm text-gray-600 truncate">
          {user.department}
        </div>
        <div className="px-3 py-2 text-sm font-semibold text-gray-900">
          {formatCurrency(user.salary)}
        </div>
        <div className="px-3 py-2 text-sm text-gray-500">
          {user.joinDate}
        </div>
        <div className="px-3 py-2">
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${statusColor}`}>
            {user.status}
          </span>
        </div>
        {/* Role badge */}
        <div className="px-2 py-2">
          <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${ROLE_COLORS[user.role]}`}>
            {user.role}
          </span>
        </div>
        {/* Actions */}
        <div className="px-2 py-2 flex items-center gap-1">
          <button
            onClick={handlePin}
            title={user.isPinned ? 'Unpin user' : 'Pin user'}
            className={`p-1 rounded hover:bg-gray-200 transition-colors text-sm ${
              user.isPinned ? 'text-yellow-600' : 'text-gray-400 hover:text-yellow-500'
            }`}
          >
            📌
          </button>
          <button
            onClick={handleDelete}
            title="Delete user"
            className="p-1 rounded hover:bg-red-100 transition-colors text-sm text-gray-400 hover:text-red-600"
          >
            🗑
          </button>
        </div>
      </div>
    );
  }
);

UserRow.displayName = 'UserRow';
