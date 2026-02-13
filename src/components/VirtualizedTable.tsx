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

const ROW_HEIGHT = 52;

// Grid column template shared between header and rows
export const GRID_COLS = 'minmax(120px,1.2fr) minmax(180px,2fr) 60px minmax(100px,1fr) minmax(90px,1fr) minmax(100px,1fr) 80px 90px';

// SortIcon declared outside the component to avoid re-creation on every render
function SortIcon({ sortConfig, column }: { sortConfig: SortConfig; column: keyof Omit<User, 'avatar'> }) {
  if (sortConfig.key !== column) {
    return <span className="text-gray-400 ml-1 text-xs">⇅</span>;
  }
  return (
    <span className="text-blue-600 ml-1 text-xs">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
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
        <UserRow
          user={user}
          onRowClick={data.onRowClick}
          isOptimisticUpdate={data.isOptimisticUpdate}
          isEven={index % 2 === 0}
        />
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

    const headerCellClass =
      'px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none flex items-center';

    return (
      <div className="overflow-x-auto min-w-0">
        {/* Header row using grid */}
        <div
          className="bg-gray-50 border-b-2 border-gray-200 sticky top-0 z-10 grid"
          style={{ gridTemplateColumns: GRID_COLS }}
        >
          <div onClick={() => handleSort('name')} className={headerCellClass}>
            Name <SortIcon sortConfig={sortConfig} column="name" />
          </div>
          <div onClick={() => handleSort('email')} className={headerCellClass}>
            Email <SortIcon sortConfig={sortConfig} column="email" />
          </div>
          <div onClick={() => handleSort('age')} className={headerCellClass}>
            Age <SortIcon sortConfig={sortConfig} column="age" />
          </div>
          <div onClick={() => handleSort('department')} className={headerCellClass}>
            Dept <SortIcon sortConfig={sortConfig} column="department" />
          </div>
          <div onClick={() => handleSort('salary')} className={headerCellClass}>
            Salary <SortIcon sortConfig={sortConfig} column="salary" />
          </div>
          <div onClick={() => handleSort('joinDate')} className={headerCellClass}>
            Join Date <SortIcon sortConfig={sortConfig} column="joinDate" />
          </div>
          <div onClick={() => handleSort('status')} className={headerCellClass}>
            Status <SortIcon sortConfig={sortConfig} column="status" />
          </div>
          <div className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center">
            Perf
          </div>
        </div>

        {/* Virtualized rows */}
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
