import React, { useMemo } from 'react';
import type { User } from '../types';
import { computeUserMetrics, formatCurrency } from '../utils';
import { GRID_COLS } from './VirtualizedTable';

interface UserRowProps {
  user: User;
  onRowClick: (user: User) => void;
  isOptimisticUpdate: boolean;
  isEven: boolean;
}

export const UserRow = React.memo(
  ({ user, onRowClick, isOptimisticUpdate, isEven }: UserRowProps) => {
    // Expensive computation memoized
    const metrics = useMemo(() => computeUserMetrics(user), [user]);

    const statusColor =
      user.status === 'active'
        ? 'bg-green-100 text-green-700'
        : 'bg-red-100 text-red-700';
    const optimisticClass = isOptimisticUpdate ? 'opacity-70' : '';
    const bgClass = isEven ? 'bg-white' : 'bg-gray-50/60';

    return (
      <div
        onClick={() => onRowClick(user)}
        className={`grid items-center h-full border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors ${optimisticClass} ${bgClass}`}
        style={{ gridTemplateColumns: GRID_COLS }}
      >
        <div className="px-3 py-2 text-sm font-medium text-gray-900 truncate">
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
        <div className="px-3 py-2 text-sm font-medium text-blue-600 text-center">
          {metrics.performanceScore}%
        </div>
      </div>
    );
  }
);

UserRow.displayName = 'UserRow';
