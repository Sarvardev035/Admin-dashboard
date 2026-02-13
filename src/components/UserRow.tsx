import React, { useMemo } from 'react';
import type { User } from '../types';
import { computeUserMetrics, formatCurrency } from '../utils';

interface UserRowProps {
  user: User;
  onRowClick: (user: User) => void;
  isOptimisticUpdate: boolean;
}

export const UserRow = React.memo(
  ({ user, onRowClick, isOptimisticUpdate }: UserRowProps) => {
    // Expensive computation memoized
    const metrics = useMemo(() => computeUserMetrics(user), [user]);

    const statusColor = user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    const optimisticClass = isOptimisticUpdate ? 'opacity-70' : '';

    return (
      <tr
        onClick={() => onRowClick(user)}
        className={`border-b border-gray-200 hover:bg-blue-50 cursor-pointer transition-colors ${optimisticClass}`}
      >
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          <div className="font-medium">{user.name}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.age}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.department}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
          {formatCurrency(user.salary)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
          {user.joinDate}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColor}`}>
            {user.status}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
          {metrics.performanceScore}%
        </td>
      </tr>
    );
  }
);

UserRow.displayName = 'UserRow';
