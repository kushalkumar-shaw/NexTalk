import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useRoomStore } from '../store/useRoomStore';
import { roomService } from '../services/room.service';
import { useSocket } from '../contexts/SocketContext';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';
import { Room, User } from '../types';

export const useRooms = () => {
  const { rooms, isLoading, activeRoomId, setRooms, addRoom, removeRoom, updateRoom, setActiveRoom, setLoading } = useRoomStore();
  const router = useRouter();
  const { socket } = useSocket();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const data = await roomService.getRooms();
        setRooms(data.rooms);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };

    if (rooms.length === 0 && isAuthenticated) {
      fetchRooms();
    }
  }, [rooms.length, setRooms, setLoading, isAuthenticated]);

  useEffect(() => {
    if (!socket || !isAuthenticated) return;

    const handleRoomAdded = (room: Room) => {
      // Check if already in list to avoid duplicates
      if (!rooms.some(r => r._id === room._id)) {
        addRoom(room);
        toast.success(`You were added to ${room.name}`);
      }
    };

    const handleMemberAdded = (data: { roomId: string, user: User }) => {
      const roomToUpdate = rooms.find(r => r._id === data.roomId);
      if (roomToUpdate) {
        updateRoom(data.roomId, {
          members: [...(roomToUpdate.members || []), data.user] as any
        });
      }
    };

    socket.on('room:added', handleRoomAdded);
    socket.on('room:member_added', handleMemberAdded);

    return () => {
      socket.off('room:added', handleRoomAdded);
      socket.off('room:member_added', handleMemberAdded);
    };
  }, [socket, isAuthenticated, addRoom, updateRoom, rooms]);

  const createRoom = async (name: string, description: string, type: 'public' | 'private') => {
    try {
      const data = await roomService.createRoom(name, description, type);
      addRoom(data.room);
      router.push(`/chat/${data.room._id}`);
      toast.success('Room created successfully');
      return data.room;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create room');
      throw error;
    }
  };

  const joinRoom = async (roomId: string) => {
    try {
      await roomService.joinRoom(roomId);
      const roomsData = await roomService.getRooms();
      setRooms(roomsData.rooms);
      router.push(`/chat/${roomId}`);
      toast.success('Joined room successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to join room');
      throw error;
    }
  };

  const leaveRoom = async (roomId: string) => {
    try {
      await roomService.leaveRoom(roomId);
      const roomsData = await roomService.getRooms();
      setRooms(roomsData.rooms);
      
      if (activeRoomId === roomId) {
        router.push('/chat');
      }
      toast.success('Left room successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to leave room');
      throw error;
    }
  };

  const deleteRoom = async (roomId: string) => {
    try {
      await roomService.deleteRoom(roomId);
      removeRoom(roomId);
      if (activeRoomId === roomId) {
        router.push('/chat');
      }
      toast.success('Room deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete room');
      throw error;
    }
  };

  return {
    rooms,
    isLoading,
    activeRoomId,
    setActiveRoom,
    createRoom,
    joinRoom,
    leaveRoom,
    deleteRoom
  };
};
