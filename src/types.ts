export type UserRole = 'admin' | 'editor' | 'viewer';

export interface UserPermissions {
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
  canManageUsers: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  department: string;
  salary: number;
  joinDate: string;
  status: 'active' | 'inactive';
  avatar?: string;
  role: UserRole;
  permissions: UserPermissions;
  isPinned: boolean;
}

export interface FilterOptions {
  department?: string;
  status?: 'active' | 'inactive';
  ageRange?: {
    min: number;
    max: number;
  };
  salaryRange?: {
    min: number;
    max: number;
  };
}

export interface SortConfig {
  key: keyof Omit<User, 'avatar'>;
  direction: 'asc' | 'desc';
}

export type StoreState = {
  users: User[];
  filteredUsers: User[];
  selectedUser: User | null;
  searchQuery: string;
  sortConfig: SortConfig;
  filters: FilterOptions;
  isLoading: boolean;
  error: string | null;
  isModalOpen: boolean;
  editingUser: User | null;
  isOptimisticUpdate: boolean;
};
