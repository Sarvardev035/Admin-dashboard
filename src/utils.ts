import type { User, UserRole } from './types';

const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'];
const ROLES: UserRole[] = ['admin', 'editor', 'viewer'];

const DEFAULT_PERMISSIONS_MAP: Record<UserRole, User['permissions']> = {
  admin: { canEdit: true, canDelete: true, canExport: true, canManageUsers: true },
  editor: { canEdit: true, canDelete: false, canExport: true, canManageUsers: false },
  viewer: { canEdit: false, canDelete: false, canExport: false, canManageUsers: false },
};

const FIRST_NAMES = [
  'John', 'Jane', 'Michael', 'Sarah', 'David', 'Emma', 'James', 'Olivia', 'Robert', 'Ava',
  'William', 'Isabella', 'Richard', 'Mia', 'Joseph', 'Charlotte', 'Thomas', 'Amelia', 'Charles', 'Harper',
  'Christopher', 'Evelyn', 'Daniel', 'Abigail', 'Matthew', 'Emily', 'Anthony', 'Elizabeth', 'Donald', 'Sofia',
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
];

export function generateMockUsers(count: number): User[] {
  const users: User[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@company.com`;
    const department = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
    const age = Math.floor(Math.random() * (65 - 22)) + 22;
    const salary = Math.floor(Math.random() * (150000 - 40000)) + 40000;
    const status = Math.random() > 0.2 ? 'active' : 'inactive';
    const joinYear = Math.floor(Math.random() * (2024 - 2015)) + 2015;
    const joinMonth = Math.floor(Math.random() * 12) + 1;
    const joinDay = Math.floor(Math.random() * 28) + 1;
    const joinDate = `${joinYear}-${String(joinMonth).padStart(2, '0')}-${String(joinDay).padStart(2, '0')}`;

    const role = ROLES[Math.floor(Math.random() * ROLES.length)];

    users.push({
      id: `user-${i + 1}`,
      name,
      email,
      department,
      age,
      salary,
      joinDate,
      status: status as 'active' | 'inactive',
      role,
      permissions: { ...DEFAULT_PERMISSIONS_MAP[role] },
      isPinned: false,
    });
  }

  return users;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Expensive computation to simulate real-world workload.
 * This is intentionally slow to demonstrate the importance of memoization in the table.
 */
export function computeUserMetrics(user: User): {
  salaryCategoryPercentile: number;
  tenure: number;
  performanceScore: number;
} {
  // Simulate expensive computation (reduced to ~1000 iterations so it's
  // noticeable but doesn't cripple UI; memoization still makes a big difference)
  let expensiveResult = 0;
  for (let i = 0; i < 1000; i++) {
    expensiveResult += Math.sqrt(i);
  }
  // Use the result so it isn't optimized away
  void expensiveResult;

  const salaryCategoryPercentile = Math.round((user.salary / 150000) * 100);
  const tenure = new Date().getFullYear() - new Date(user.joinDate).getFullYear();
  // Deterministic performance score based on user data (no Math.random)
  const hash = user.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const performanceScore = Math.min(100, 50 + (hash % 50) + tenure * 2);

  return {
    salaryCategoryPercentile,
    tenure,
    performanceScore,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
