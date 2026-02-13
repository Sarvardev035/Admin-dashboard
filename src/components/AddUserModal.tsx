import React, { useState } from 'react';
import type { User, UserRole } from '../types';

const DEPARTMENTS = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'];
const ROLES: UserRole[] = ['viewer', 'editor', 'admin'];

const DEFAULT_PERMS: Record<UserRole, User['permissions']> = {
  admin: { canEdit: true, canDelete: true, canExport: true, canManageUsers: true },
  editor: { canEdit: true, canDelete: false, canExport: true, canManageUsers: false },
  viewer: { canEdit: false, canDelete: false, canExport: false, canManageUsers: false },
};

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: User) => void;
}

const initialForm = {
  name: '',
  email: '',
  age: '',
  department: 'Engineering',
  salary: '',
  status: 'active' as 'active' | 'inactive',
  role: 'viewer' as UserRole,
};

export const AddUserModal = React.memo(({ isOpen, onClose, onAdd }: AddUserModalProps) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email';
    if (!form.age || Number(form.age) < 18 || Number(form.age) > 100) errs.age = 'Age must be 18–100';
    if (!form.salary || Number(form.salary) < 0) errs.salary = 'Salary must be positive';
    return errs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const now = new Date();
    const joinDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      age: Number(form.age),
      department: form.department,
      salary: Number(form.salary),
      joinDate,
      status: form.status,
      role: form.role,
      permissions: { ...DEFAULT_PERMS[form.role] },
      isPinned: false,
    };

    onAdd(newUser);
    setForm(initialForm);
    setErrors({});
  };

  const handleCancel = () => {
    setForm(initialForm);
    setErrors({});
    onClose();
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
      errors[field] ? 'border-red-400' : 'border-gray-300'
    }`;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-green-600 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-lg font-bold">Add New User</h2>
          <button onClick={handleCancel} className="text-white hover:bg-green-700 rounded p-1 text-xl leading-none">
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Smith"
              className={inputClass('name')}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="john.smith@company.com"
              className={inputClass('email')}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Age & Department row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                min="18"
                max="100"
                placeholder="30"
                className={inputClass('age')}
              />
              {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                className={inputClass('department')}
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Salary & Status row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary ($)</label>
              <input
                type="number"
                name="salary"
                value={form.salary}
                onChange={handleChange}
                min="0"
                placeholder="75000"
                className={inputClass('salary')}
              />
              {errors.salary && <p className="text-xs text-red-500 mt-1">{errors.salary}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className={inputClass('status')}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className={inputClass('role')}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-green-600 rounded-lg hover:bg-green-700 transition font-medium"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

AddUserModal.displayName = 'AddUserModal';
