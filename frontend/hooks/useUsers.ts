import { useEffect, useState } from 'react';
import { useUserStore } from '../store/useUserStore';
import { userService } from '../services/user.service';
import toast from 'react-hot-toast';

export const useUsers = () => {
  const { users, onlineUserIds, setUsers } = useUserStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const data = await userService.getUsers();
        setUsers(data.users);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };

    if (users.length === 0) {
      fetchUsers();
    }
  }, [users.length, setUsers]);

  const searchUsers = async (query: string) => {
    try {
      const data = await userService.getUsers(query);
      return data.users;
    } catch (error: any) {
      toast.error(error.message || 'Search failed');
      return [];
    }
  };

  const onlineUsers = users.filter((u) => onlineUserIds.includes(u._id) || u.isOnline);

  return {
    users,
    onlineUsers,
    isLoading,
    searchUsers
  };
};
