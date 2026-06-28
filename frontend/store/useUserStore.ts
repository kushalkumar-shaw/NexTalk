import { create } from 'zustand';
import { User } from '../types';

interface UserState {
  users: User[];
  onlineUserIds: string[];
  setUsers: (users: User[]) => void;
  setUserOnline: (userId: string) => void;
  setUserOffline: (userId: string) => void;
  updateUser: (userId: string, partial: Partial<User>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  onlineUserIds: [],
  setUsers: (users) => set({ 
    users, 
    onlineUserIds: users.filter((u) => u.isOnline).map((u) => u._id)
  }),
  setUserOnline: (userId) => set((state) => {
    if (state.onlineUserIds.includes(userId)) return state;
    
    const updatedUsers = state.users.map((u) => u._id === userId ? { ...u, isOnline: true } : u);
    return { 
      onlineUserIds: [...state.onlineUserIds, userId],
      users: updatedUsers
    };
  }),
  setUserOffline: (userId) => set((state) => {
    const updatedUsers = state.users.map((u) => u._id === userId ? { ...u, isOnline: false } : u);
    return { 
      onlineUserIds: state.onlineUserIds.filter((id) => id !== userId),
      users: updatedUsers
    };
  }),
  updateUser: (userId, partial) => set((state) => ({
    users: state.users.map((u) => u._id === userId ? { ...u, ...partial } : u)
  }))
}));
