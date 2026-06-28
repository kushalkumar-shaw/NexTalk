"use client";

import React, { createContext, useContext, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { authService } from '../services/auth.service';
import { disconnectSocket } from '../lib/socket';

interface AuthContextType {
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { hydrate, setUser, setToken, logout: storeLogout, isLoading } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password);
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (username: string, email: string, password: string) => {
    const data = await authService.register(username, email, password);
    setToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      storeLogout();
      disconnectSocket();
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-chat-bg">
        <div className="flex flex-col items-center gap-4 text-brand">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-current border-t-transparent"></div>
          <span className="text-xl font-bold">NexTalk</span>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
