import { useCallback, useState } from 'react';
import { useStore } from './store';
import { useLoadUsers, useSearchOnEnter } from './hooks';
import { SearchAndFilter } from './components/SearchAndFilter';
import { VirtualizedTable } from './components/VirtualizedTable';
import { UserDetailsModal } from './components/UserDetailsModal';
import { AddUserModal } from './components/AddUserModal';
import { BulkActionsBar } from './components/BulkActionsBar';
import { ErrorNotification, LoadingState, EmptyState } from './components/States';
import { LoginPage } from './components/LoginPage';
import type { SortConfig, User } from './types';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem('auth') === 'true'
  );

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('auth');
    setIsAuthenticated(false);
  }, []);

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
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
  const addUser = useStore((state) => state.addUser);

  // Add user modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Load users on mount
  useLoadUsers();

  // Search fires only on Enter
  const handleSearchChange = useSearchOnEnter();

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

  // Handle add new user
  const handleAddUser = useCallback((user: User) => {
    addUser(user);
    setIsAddModalOpen(false);
  }, [addUser]);

  const resultCount = filteredUsers.length;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage and view 10,000+ users with high-performance rendering</p>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Logout
          </button>
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

            {/* Bulk Actions */}
            <BulkActionsBar />

            {/* Results Count + Add User */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{resultCount}</span> of{' '}
                <span className="font-semibold text-gray-900">{useStore.getState().users.length.toLocaleString()}</span> users
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add User
              </button>
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

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddUser}
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
