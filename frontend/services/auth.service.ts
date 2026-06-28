import apiClient from '../lib/axios';
import { ApiResponse, User } from '../types';

export const authService = {
  async register(username: string, email: string, password: string) {
    const { data } = await apiClient.post<ApiResponse<{ user: User; token: string }>>('/auth/register', {
      username,
      email,
      password,
    });
    return data.data;
  },

  async login(email: string, password: string) {
    const { data } = await apiClient.post<ApiResponse<{ user: User; token: string }>>('/auth/login', {
      email,
      password,
    });
    return data.data;
  },

  async logout() {
    await apiClient.post<ApiResponse<null>>('/auth/logout');
  },

  async getMe() {
    const { data } = await apiClient.get<ApiResponse<{ user: User }>>('/auth/me');
    return data.data;
  }
};
