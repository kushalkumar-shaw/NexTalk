export interface User {
  _id: string;
  username: string;
  email: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
  createdAt: string;
}

export interface Room {
  _id: string;
  name: string;
  description: string;
  type: "public" | "private";
  createdBy: string | User;
  members: string[] | User[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  content: string;
  sender: User;
  room: string;
  type: "text" | "system";
  readBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalMessages: number;
  hasMore: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface TypingUser {
  _id: string;
  username: string;
}
