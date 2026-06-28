import apiClient from '../lib/axios';
import { ApiResponse, User } from '../types';

export const userService = {
  async getUsers(search?: string) {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const { data } = await apiClient.get<ApiResponse<{ users: User[] }>>(`/users${query}`);
    return data.data;
  },

  async getUserById(id: string) {
    const { data } = await apiClient.get<ApiResponse<{ user: User }>>(`/users/${id}`);
    return data.data;
  }
};
