import React, { useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import type { User, SortConfig } from '../types';
import { UserRow } from './UserRow';

interface VirtualizedTableProps {
  users: User[];
  onRowClick: (user: User) => void;
  sortConfig: SortConfig;
  onSort: (key: keyof Omit<User, 'avatar'>) => void;
  isOptimisticUpdate: boolean;
}

const ROW_HEIGHT = 60;

// SortIcon declared outside the component to avoid re-creation on every render
function SortIcon({ sortConfig, column }: { sortConfig: SortConfig; column: keyof Omit<User, 'avatar'> }) {
  if (sortConfig.key !== column) {
    return <span className="text-gray-400 ml-2">⇅</span>;
  }
  return (
    <span className="text-blue-600 ml-2">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
  );
}

const Row = React.memo(
  ({
    index,
    style,
    data,
  }: {
    index: number;
    style: React.CSSProperties;
    data: {
      users: User[];
      onRowClick: (user: User) => void;
      isOptimisticUpdate: boolean;
    };
  }) => {
    const user = data.users[index];

    return (
      <div style={style}>
        <table className="w-full">
          <tbody>
            <UserRow
              user={user}
              onRowClick={data.onRowClick}
              isOptimisticUpdate={data.isOptimisticUpdate}
            />
          </tbody>
        </table>
      </div>
    );
  }
);

Row.displayName = 'Row';

export const VirtualizedTable = React.memo(
  ({
    users,
    onRowClick,
    sortConfig,
    onSort,
    isOptimisticUpdate,
  }: VirtualizedTableProps) => {
    const itemData = useMemo(
      () => ({
        users,
        onRowClick,
        isOptimisticUpdate,
      }),
      [users, onRowClick, isOptimisticUpdate]
    );

    const handleSort = useCallback(
      (key: keyof Omit<User, 'avatar'>) => {
        onSort(key);
      },
      [onSort]
    );

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr className="border-b-2 border-gray-300">
              <th
                onClick={() => handleSort('name')}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
              >
                Name <SortIcon sortConfig={sortConfig} column="name" />
              </th>
              <th
                onClick={() => handleSort('email')}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
              >
                Email <SortIcon sortConfig={sortConfig} column="email" />
              </th>
              <th
                onClick={() => handleSort('age')}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
              >
                Age <SortIcon sortConfig={sortConfig} column="age" />
              </th>
              <th
                onClick={() => handleSort('department')}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
              >
                Department <SortIcon sortConfig={sortConfig} column="department" />
              </th>
              <th
                onClick={() => handleSort('salary')}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
              >
                Salary <SortIcon sortConfig={sortConfig} column="salary" />
              </th>
              <th
                onClick={() => handleSort('joinDate')}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
              >
                Join Date <SortIcon sortConfig={sortConfig} column="joinDate" />
              </th>
              <th
                onClick={() => handleSort('status')}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100"
              >
                Status <SortIcon sortConfig={sortConfig} column="status" />
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                Performance
              </th>
            </tr>
          </thead>
        </table>
        
        {users.length > 0 ? (
          <List
            height={600}
            itemCount={users.length}
            itemSize={ROW_HEIGHT}
            width="100%"
            itemData={itemData}
          >
            {Row}
          </List>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No users found
          </div>
        )}
      </div>
    );
  }
);

VirtualizedTable.displayName = 'VirtualizedTable';
