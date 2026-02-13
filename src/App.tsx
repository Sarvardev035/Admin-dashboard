import { useCallback, useEffect } from 'react';
import { useStore } from './store';
import { useLoadUsers, useDebouncedSearch } from './hooks';
import { SearchAndFilter } from './components/SearchAndFilter';
import { VirtualizedTable } from './components/VirtualizedTable';
import { UserDetailsModal } from './components/UserDetailsModal';
import { ErrorNotification, LoadingState, EmptyState } from './components/States';
import type { SortConfig, User } from './types';
import './App.css';

function App() {
  // Store state
  const filteredUsers = useStore((state) => state.filteredUsers);
  const searchQuery = useStore((state) => state.searchQuery);
  const filters = useStore((state) => state.filters);
  const sortConfig = useStore((state) => state.sortConfig);
  const isLoading = useStore((state) => state.isLoading);
  const error = useStore((state) => state.error);
  const isModalOpen = useStore((state) => state.isModalOpen);
  const selectedUser = useStore((state) => state.selectedUser);
  const isOptimisticUpdate = useStore((state) => state.isOptimisticUpdate);

  // Store actions
  const setModalOpen = useStore((state) => state.setModalOpen);
  const setSortConfig = useStore((state) => state.setSortConfig);
  const updateUser = useStore((state) => state.updateUser);
  const setError = useStore((state) => state.setError);

  // Load users on mount
  useLoadUsers();

  // Setup debounced search
  const handleSearchChange = useDebouncedSearch(400);

  // Handle search input
  const handleSearch = useCallback(
    (query: string) => {
      handleSearchChange(query);
    },
    [handleSearchChange]
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    (newFilters: any) => {
      useStore.setState({ filters: newFilters });
      useStore.getState().filterAndSortUsers();
    },
    []
  );

  // Handle row click to open modal
  const handleRowClick = useCallback((user: User) => {
    useStore.setState({ selectedUser: user });
    setModalOpen(true);
  }, [setModalOpen]);

  // Handle sort
  const handleSort = useCallback((key: keyof Omit<User, 'avatar'>) => {
    const newDirection = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    const newSortConfig: SortConfig = { key, direction: newDirection };
    setSortConfig(newSortConfig);
  }, [sortConfig, setSortConfig]);

  // Handle modal close
  const handleModalClose = useCallback(() => {
    setModalOpen(false);
  }, [setModalOpen]);

  // Handle user save (optimistic update)
  const handleUserSave = useCallback((user: User) => {
    updateUser(user);
  }, [updateUser]);

  const resultCount = filteredUsers.length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage and view 10,000+ users with high-performance rendering</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Notification */}
        {error && (
          <ErrorNotification
            message={error}
            onDismiss={() => setError(null)}
          />
        )}

        {/* Loading State */}
        {isLoading ? (
          <LoadingState />
        ) : (
          <>
            {/* Search and Filter */}
            <SearchAndFilter
              searchQuery={searchQuery}
              onSearchChange={handleSearch}
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            {/* Results Count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{resultCount}</span> of{' '}
                <span className="font-semibold text-gray-900">10,000</span> users
              </p>
            </div>

            {/* Users Table */}
            {filteredUsers.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <VirtualizedTable
                  users={filteredUsers}
                  onRowClick={handleRowClick}
                  sortConfig={sortConfig}
                  onSort={handleSort}
                  isOptimisticUpdate={isOptimisticUpdate}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow">
                <EmptyState />
              </div>
            )}
          </>
        )}
      </main>

      {/* User Details Modal */}
      <UserDetailsModal
        isOpen={isModalOpen}
        user={selectedUser}
        onClose={handleModalClose}
        onSave={handleUserSave}
        isOptimisticUpdate={isOptimisticUpdate}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-gray-600 text-sm">
          <p>High-Performance React Dashboard with Row Virtualization &copy; 2026</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
