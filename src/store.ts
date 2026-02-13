import { create } from 'zustand';
import type { User, UserRole, UserPermissions, FilterOptions, SortConfig, StoreState } from './types';

const DEFAULT_PERMISSIONS: Record<UserRole, UserPermissions> = {
  admin: { canEdit: true, canDelete: true, canExport: true, canManageUsers: true },
  editor: { canEdit: true, canDelete: false, canExport: true, canManageUsers: false },
  viewer: { canEdit: false, canDelete: false, canExport: false, canManageUsers: false },
};

interface StoreActions {
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  deleteUser: (userId: string) => void;
  deleteUsers: (userIds: string[]) => void;
  togglePinUser: (userId: string) => void;
  setUserRole: (userId: string, role: UserRole) => void;
  setUserPermission: (userId: string, key: keyof UserPermissions, value: boolean) => void;
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
  // Selection
  selectedIds: Set<string>;
  toggleSelectUser: (userId: string) => void;
  selectAllVisible: () => void;
  clearSelection: () => void;
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
  selectedIds: new Set<string>(),

  setUsers: (users) => {
    set({ users });
    // Trigger filtering when users change
    setTimeout(() => {
      get().filterAndSortUsers();
    }, 0);
  },

  addUser: (user) => {
    const users = [user, ...get().users];
    set({ users });
    get().filterAndSortUsers();
  },

  deleteUser: (userId) => {
    const users = get().users.filter((u) => u.id !== userId);
    const selectedIds = new Set(get().selectedIds);
    selectedIds.delete(userId);
    set({ users, selectedIds });
    get().filterAndSortUsers();
  },

  deleteUsers: (userIds) => {
    const idsSet = new Set(userIds);
    const users = get().users.filter((u) => !idsSet.has(u.id));
    set({ users, selectedIds: new Set() });
    get().filterAndSortUsers();
  },

  togglePinUser: (userId) => {
    const users = get().users.map((u) =>
      u.id === userId ? { ...u, isPinned: !u.isPinned } : u
    );
    set({ users });
    get().filterAndSortUsers();
  },

  setUserRole: (userId, role) => {
    const users = get().users.map((u) =>
      u.id === userId ? { ...u, role, permissions: { ...DEFAULT_PERMISSIONS[role] } } : u
    );
    set({ users });
    // Update selectedUser if it's the one being changed
    const selectedUser = get().selectedUser;
    if (selectedUser?.id === userId) {
      const updated = users.find((u) => u.id === userId) ?? null;
      set({ selectedUser: updated });
    }
    get().filterAndSortUsers();
  },

  setUserPermission: (userId, key, value) => {
    const users = get().users.map((u) =>
      u.id === userId ? { ...u, permissions: { ...u.permissions, [key]: value } } : u
    );
    set({ users });
    const selectedUser = get().selectedUser;
    if (selectedUser?.id === userId) {
      const updated = users.find((u) => u.id === userId) ?? null;
      set({ selectedUser: updated });
    }
    get().filterAndSortUsers();
  },

  toggleSelectUser: (userId) => {
    const selectedIds = new Set(get().selectedIds);
    if (selectedIds.has(userId)) {
      selectedIds.delete(userId);
    } else {
      selectedIds.add(userId);
    }
    set({ selectedIds });
  },

  selectAllVisible: () => {
    const ids = new Set(get().filteredUsers.map((u) => u.id));
    set({ selectedIds: ids });
  },

  clearSelection: () => {
    set({ selectedIds: new Set() });
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

    // Apply sorting — pinned users always first
    filtered.sort((a, b) => {
      // Pinned users come first
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

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
