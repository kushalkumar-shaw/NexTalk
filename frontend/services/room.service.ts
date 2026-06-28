import apiClient from '../lib/axios';
import { ApiResponse, Room } from '../types';

export const roomService = {
  async getRooms() {
    const { data } = await apiClient.get<ApiResponse<{ rooms: Room[] }>>('/rooms');
    return data.data;
  },

  async getRoomById(id: string) {
    const { data } = await apiClient.get<ApiResponse<{ room: Room }>>(`/rooms/${id}`);
    return data.data;
  },

  async createRoom(name: string, description: string, type: 'public' | 'private') {
    const { data } = await apiClient.post<ApiResponse<{ room: Room }>>('/rooms', {
      name,
      description,
      type
    });
    return data.data;
  },

  async joinRoom(id: string) {
    const { data } = await apiClient.post<ApiResponse<{ room: Room }>>(`/rooms/${id}/join`);
    return data.data;
  },

  async leaveRoom(id: string): Promise<void> {
    await apiClient.post(`/rooms/${id}/leave`);
  },

  async addMemberToRoom(roomId: string, userId: string): Promise<Room> {
    const response = await apiClient.post(`/rooms/${roomId}/members`, { userId });
    return response.data.data.room;
  },

  async deleteRoom(id: string) {
    await apiClient.delete<ApiResponse<null>>(`/rooms/${id}`);
  }
};
