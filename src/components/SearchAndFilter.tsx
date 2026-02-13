import React, { useCallback } from 'react';
import type { FilterOptions } from '../types';

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'];
const STATUSES = ['active', 'inactive'];

export const SearchAndFilter = React.memo(
  ({ searchQuery, onSearchChange, filters, onFilterChange }: SearchAndFilterProps) => {
    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
      },
      [onSearchChange]
    );

    const handleDepartmentChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value || undefined;
        onFilterChange({
          ...filters,
          department: value as string | undefined,
        });
      },
      [filters, onFilterChange]
    );

    const handleStatusChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value || undefined;
        onFilterChange({
          ...filters,
          status: value as 'active' | 'inactive' | undefined,
        });
      },
      [filters, onFilterChange]
    );

    const handleAgeMinChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const min = parseInt(e.target.value, 10) || 0;
        onFilterChange({
          ...filters,
          ageRange: {
            min,
            max: filters.ageRange?.max || 100,
          },
        });
      },
      [filters, onFilterChange]
    );

    const handleAgeMaxChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const max = parseInt(e.target.value, 10) || 100;
        onFilterChange({
          ...filters,
          ageRange: {
            min: filters.ageRange?.min || 0,
            max,
          },
        });
      },
      [filters, onFilterChange]
    );

    const resetFilters = useCallback(() => {
      onSearchChange('');
      onFilterChange({});
    }, [onSearchChange, onFilterChange]);

    return (
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
        <div className="flex flex-wrap gap-3 items-end">
          {/* Search */}
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Search Users</label>
            <input
              type="text"
              placeholder="Name, email, or department..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Department Filter */}
          <div className="min-w-[140px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Department</label>
            <select
              value={filters.department || ''}
              onChange={handleDepartmentChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="min-w-[120px]">
            <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
            <select
              value={filters.status || ''}
              onChange={handleStatusChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Age Range Filter */}
          <div className="flex gap-2 min-w-[160px]">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Min Age</label>
              <input
                type="number"
                min="0"
                max="100"
                value={filters.ageRange?.min || 0}
                onChange={handleAgeMinChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Max Age</label>
              <input
                type="number"
                min="0"
                max="100"
                value={filters.ageRange?.max || 100}
                onChange={handleAgeMaxChange}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    );
  }
);

SearchAndFilter.displayName = 'SearchAndFilter';
