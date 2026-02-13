import { useEffect, useCallback } from 'react';
import { useStore } from './store';

export function useLoadUsers() {
  const setUsers = useStore((state) => state.setUsers);
  const setIsLoading = useStore((state) => state.setIsLoading);
  const setError = useStore((state) => state.setError);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Dynamic import to avoid including data generation in the bundle initially
        const { generateMockUsers } = await import('./utils');

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const mockUsers = generateMockUsers(10000);
        setUsers(mockUsers);
      } catch (err) {
        setError('Failed to load users. Please refresh the page.');
        console.error('Error loading users:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUsers();
  }, [setUsers, setIsLoading, setError]);
}

export function useSearchOnEnter() {
  const setSearchQuery = useStore((state) => state.setSearchQuery);
  const filterAndSortUsers = useStore((state) => state.filterAndSortUsers);

  return useCallback(
    (query: string) => {
      setSearchQuery(query);
      filterAndSortUsers();
    },
    [setSearchQuery, filterAndSortUsers]
  );
}

export function useUserModal() {
  const isModalOpen = useStore((state) => state.isModalOpen);
  const setModalOpen = useStore((state) => state.setModalOpen);
  const selectedUser = useStore((state) => state.selectedUser);
  const setSelectedUser = useStore((state) => state.setSelectedUser);

  const openModal = (user: any) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return {
    isModalOpen,
    openModal,
    closeModal,
    selectedUser,
  };
}
