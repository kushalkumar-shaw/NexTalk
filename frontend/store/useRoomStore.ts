import { create } from 'zustand';
import { Room } from '../types';

interface RoomState {
  rooms: Room[];
  activeRoomId: string | null;
  isLoading: boolean;
  setRooms: (rooms: Room[]) => void;
  addRoom: (room: Room) => void;
  removeRoom: (roomId: string) => void;
  updateRoom: (roomId: string, data: Partial<Room>) => void;
  setActiveRoom: (roomId: string | null) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  rooms: [],
  activeRoomId: null,
  isLoading: false,
  setRooms: (rooms) => set({ rooms }),
  addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
  removeRoom: (roomId) => set((state) => ({ rooms: state.rooms.filter((r) => r._id !== roomId) })),
  updateRoom: (roomId, data) => set((state) => ({
    rooms: state.rooms.map((r) => r._id === roomId ? { ...r, ...data } : r)
  })),
  setActiveRoom: (activeRoomId) => set({ activeRoomId }),
  setLoading: (isLoading) => set({ isLoading })
}));
