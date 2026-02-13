import { create } from 'zustand';
import type { User, FilterOptions, SortConfig, StoreState } from './types';

interface StoreActions {
  setUsers: (users: User[]) => void;
  setSearchQuery: (query: string) => void;
  setSortConfig: (config: SortConfig) => void;
  setFilters: (filters: FilterOptions) => void;
  setSelectedUser: (user: User | null) => void;
  setModalOpen: (isOpen: boolean) => void;
  setEditingUser: (user: User | null) => void;
  updateUser: (user: User) => void;
  rollbackUser: (originalUser: User) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  filterAndSortUsers: () => void;
}

export const useStore = create<StoreState & StoreActions>((set, get) => ({
  users: [],
  filteredUsers: [],
  selectedUser: null,
  searchQuery: '',
  sortConfig: { key: 'name', direction: 'asc' },
  filters: {},
  isLoading: false,
  error: null,
  isModalOpen: false,
  editingUser: null,
  isOptimisticUpdate: false,

  setUsers: (users) => {
    set({ users });
    // Trigger filtering when users change
    setTimeout(() => {
      get().filterAndSortUsers();
    }, 0);
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    // Filtering is done via debounce in the hook
  },

  setSortConfig: (sortConfig) => {
    set({ sortConfig });
    get().filterAndSortUsers();
  },

  setFilters: (filters) => {
    set({ filters });
    get().filterAndSortUsers();
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },

  setModalOpen: (isOpen) => {
    set({ isModalOpen: isOpen });
    if (!isOpen) {
      set({ editingUser: null });
    }
  },

  setEditingUser: (user) => {
    set({ editingUser: user });
  },

  updateUser: (updatedUser) => {
    // Save original user BEFORE applying changes for rollback
    const originalUser = get().users.find((u) => u.id === updatedUser.id);
    const users = get().users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    set({ users, selectedUser: updatedUser, editingUser: updatedUser, isOptimisticUpdate: true });
    get().filterAndSortUsers();

    // Simulate occasional failures (10% chance)
    const shouldFail = Math.random() < 0.1;
    setTimeout(() => {
      if (shouldFail && originalUser) {
        // Simulate failure - rollback to the ORIGINAL user
        get().rollbackUser(originalUser);
        set({ error: 'Failed to update user. Changes rolled back.' });
        setTimeout(() => set({ error: null }), 3000);
      } else {
        set({ isOptimisticUpdate: false });
      }
    }, 800);
  },

  rollbackUser: (originalUser) => {
    const users = get().users.map((u) => (u.id === originalUser.id ? originalUser : u));
    set({ users, selectedUser: originalUser, editingUser: originalUser, isOptimisticUpdate: false });
    get().filterAndSortUsers();
  },

  setIsLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error });
  },

  filterAndSortUsers: () => {
    const { users, searchQuery, filters, sortConfig } = get();

    const filtered = users.filter((user) => {
      const matchesSearch =
        searchQuery === '' ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.department.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment = !filters.department || user.department === filters.department;
      const matchesStatus = !filters.status || user.status === filters.status;
      const matchesAge =
        !filters.ageRange ||
        (user.age >= filters.ageRange.min && user.age <= filters.ageRange.max);
      const matchesSalary =
        !filters.salaryRange ||
        (user.salary >= filters.salaryRange.min && user.salary <= filters.salaryRange.max);

      return matchesSearch && matchesDepartment && matchesStatus && matchesAge && matchesSalary;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (typeof aVal === 'string') {
        const comparison = (aVal as string).localeCompare(bVal as string);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      const comparison = (aVal as number) - (bVal as number);
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });

    set({ filteredUsers: filtered });
  },
}));
