import React, { useMemo, useCallback, useState } from 'react';
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
const PAGE_SIZE = 50;

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
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));

    // Reset to page 1 when users list changes significantly (e.g. filter/search)
    const pageUsers = useMemo(() => {
      const safeCurrentPage = Math.min(currentPage, totalPages);
      if (safeCurrentPage !== currentPage) {
        // Will be corrected on next render via the effect below
      }
      const start = (safeCurrentPage - 1) * PAGE_SIZE;
      return users.slice(start, start + PAGE_SIZE);
    }, [users, currentPage, totalPages]);

    // Reset page if current page exceeds total pages
    React.useEffect(() => {
      if (currentPage > totalPages) {
        setCurrentPage(1);
      }
    }, [currentPage, totalPages]);

    const itemData = useMemo(
      () => ({
        users: pageUsers,
        onRowClick,
        isOptimisticUpdate,
      }),
      [pageUsers, onRowClick, isOptimisticUpdate]
    );

    const handleSort = useCallback(
      (key: keyof Omit<User, 'avatar'>) => {
        onSort(key);
        setCurrentPage(1);
      },
      [onSort]
    );

    const listHeight = Math.min(600, pageUsers.length * ROW_HEIGHT);

    // Generate page numbers to show
    const pageNumbers = useMemo(() => {
      const pages: (number | '...')[] = [];
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        if (currentPage > 3) pages.push('...');
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (currentPage < totalPages - 2) pages.push('...');
        pages.push(totalPages);
      }
      return pages;
    }, [totalPages, currentPage]);

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
        {pageUsers.length > 0 ? (
          <List
            height={listHeight}
            itemCount={pageUsers.length}
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Page {currentPage} of {totalPages} · {users.length.toLocaleString()} users
            </p>
            <div className="flex items-center gap-1">
              {/* Prev */}
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1.5 text-xs rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ← Prev
              </button>

              {/* Page numbers */}
              {pageNumbers.map((page, i) =>
                page === '...' ? (
                  <span key={`dots-${i}`} className="px-1 text-xs text-gray-400">…</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-2.5 py-1.5 text-xs rounded-md border transition ${
                      currentPage === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next */}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1.5 text-xs rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

VirtualizedTable.displayName = 'VirtualizedTable';
