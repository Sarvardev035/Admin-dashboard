import React, { useState, useEffect, useCallback } from 'react';
import type { User, UserRole, UserPermissions } from '../types';
import { formatCurrency, formatDate } from '../utils';
import { useStore } from '../store';

interface UserDetailsModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onSave: (user: User) => void;
  isOptimisticUpdate: boolean;
}

const PERMISSION_LABELS: Record<keyof UserPermissions, string> = {
  canEdit: 'Edit Users',
  canDelete: 'Delete Users',
  canExport: 'Export Data',
  canManageUsers: 'Manage Users',
};

export const UserDetailsModal = React.memo(
  ({ isOpen, user, onClose, onSave, isOptimisticUpdate }: UserDetailsModalProps) => {
    const [formData, setFormData] = useState<User | null>(user);
    const [activeTab, setActiveTab] = useState<'details' | 'access'>('details');
    const setUserRole = useStore((state) => state.setUserRole);
    const setUserPermission = useStore((state) => state.setUserPermission);
    const togglePinUser = useStore((state) => state.togglePinUser);
    const deleteUser = useStore((state) => state.deleteUser);

    useEffect(() => {
      setFormData(user);
    }, [user]);

    const handleDelete = useCallback(() => {
      if (user && window.confirm(`Delete ${user.name}? This cannot be undone.`)) {
        deleteUser(user.id);
        onClose();
      }
    }, [user, deleteUser, onClose]);

    const handlePin = useCallback(() => {
      if (user) togglePinUser(user.id);
    }, [user, togglePinUser]);

    const handleRoleChange = useCallback(
      (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (user) {
          setUserRole(user.id, e.target.value as UserRole);
        }
      },
      [user, setUserRole]
    );

    const handlePermissionToggle = useCallback(
      (key: keyof UserPermissions) => {
        if (user) {
          setUserPermission(user.id, key, !user.permissions[key]);
        }
      },
      [user, setUserPermission]
    );

    if (!isOpen || !formData) {
      return null;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      setFormData((prev) => {
        if (!prev) return null;

        if (name === 'age' || name === 'salary') {
          return { ...prev, [name]: parseInt(value, 10) };
        }

        return { ...prev, [name]: value };
      });
    };

    const handleSave = () => {
      if (formData) {
        onSave(formData);
      }
    };

    const handleCancel = () => {
      setFormData(user);
      onClose();
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">User Management</h2>
              <p className="text-blue-200 text-sm">{user?.name}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePin}
                title={user?.isPinned ? 'Unpin' : 'Pin'}
                className={`p-1.5 rounded hover:bg-blue-700 transition-colors ${user?.isPinned ? 'text-yellow-300' : 'text-blue-200'}`}
              >
                📌
              </button>
              <button
                onClick={handleDelete}
                title="Delete user"
                className="p-1.5 rounded hover:bg-red-500 transition-colors text-blue-200 hover:text-white"
              >
                🗑
              </button>
              <button
                onClick={handleCancel}
                className="text-white hover:bg-blue-700 rounded p-1 ml-1"
              >
                ×
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'details'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('access')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'access'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Role & Access
            </button>
          </div>

          {/* Status Indicator */}
          {isOptimisticUpdate && (
            <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-2">
              <p className="text-sm text-yellow-800 flex items-center">
                <span className="inline-block animate-spin mr-2">⟳</span>
                Saving changes...
              </p>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === 'details' && (
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={isOptimisticUpdate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={isOptimisticUpdate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} disabled={isOptimisticUpdate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                  <input type="number" name="salary" value={formData.salary} onChange={handleChange} disabled={isOptimisticUpdate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100" />
                  <p className="text-xs text-gray-500 mt-1">{formatCurrency(formData.salary)}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select name="department" value={formData.department} onChange={handleChange} disabled={isOptimisticUpdate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
                    <option>Engineering</option><option>Sales</option><option>Marketing</option>
                    <option>HR</option><option>Finance</option><option>Operations</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} disabled={isOptimisticUpdate}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
                    <option value="active">Active</option><option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Join Date</label>
                <input type="text" value={formatDate(formData.joinDate)} disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed" />
              </div>
            </div>
          )}

          {/* Role & Access Tab */}
          {activeTab === 'access' && user && (
            <div className="px-6 py-4 space-y-5">
              {/* Role Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">User Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['admin', 'editor', 'viewer'] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => { if (user) setUserRole(user.id, role); }}
                      className={`px-3 py-2.5 text-sm font-medium rounded-lg border-2 transition-all ${
                        user.role === role
                          ? role === 'admin'
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : role === 'editor'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-400 bg-gray-50 text-gray-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-lg mb-0.5">
                        {role === 'admin' ? '👑' : role === 'editor' ? '✏️' : '👁'}
                      </div>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Permissions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                <div className="space-y-2">
                  {(Object.entries(PERMISSION_LABELS) as [keyof UserPermissions, string][]).map(
                    ([key, label]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm text-gray-700">{label}</span>
                        <button
                          onClick={() => handlePermissionToggle(key)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            user.permissions[key] ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${
                              user.permissions[key] ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Pin Status */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="text-sm font-medium text-gray-700">📌 Pin to Top</span>
                  <p className="text-xs text-gray-500">Pinned users always appear first in the list</p>
                </div>
                <button
                  onClick={handlePin}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    user.isPinned ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${
                      user.isPinned ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Danger Zone */}
              <div className="border border-red-200 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-red-700 mb-2">Danger Zone</h4>
                <p className="text-xs text-gray-500 mb-3">Permanently delete this user and all associated data.</p>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                >
                  Delete User
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          {activeTab === 'details' && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t">
              <button
                onClick={handleCancel}
                disabled={isOptimisticUpdate}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isOptimisticUpdate}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isOptimisticUpdate ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

UserDetailsModal.displayName = 'UserDetailsModal';
