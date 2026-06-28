import apiClient from '../lib/axios';
import { ApiResponse, Message, Pagination } from '../types';

export const messageService = {
  async getMessages(roomId: string, page: number = 1, limit: number = 50) {
    const { data } = await apiClient.get<ApiResponse<{ messages: Message[]; pagination: Pagination }>>(`/messages/room/${roomId}?page=${page}&limit=${limit}`);
    return data.data;
  }
};
