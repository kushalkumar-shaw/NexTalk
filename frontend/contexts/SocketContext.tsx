"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { createSocket, disconnectSocket, getSocket } from '../lib/socket';
import { useAuthStore } from '../store/useAuthStore';
import { useUserStore } from '../store/useUserStore';
import toast from 'react-hot-toast';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, token } = useAuthStore();
  const { setUserOnline, setUserOffline } = useUserStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const newSocket = createSocket(token || "");
      setSocket(newSocket);

      newSocket.on('connect', () => {
        setIsConnected(true);
      });

      newSocket.on('disconnect', () => {
        setIsConnected(false);
      });

      newSocket.on('connect_error', () => {
        toast.error('Socket connection error. Retrying...', { id: 'socket-error' });
      });

      newSocket.on('user:online', (data: { userId: string; username: string }) => {
        setUserOnline(data.userId);
      });

      newSocket.on('user:offline', (data: { userId: string; lastSeen: string }) => {
        setUserOffline(data.userId);
      });

      return () => {
        newSocket.off('connect');
        newSocket.off('disconnect');
        newSocket.off('connect_error');
        newSocket.off('user:online');
        newSocket.off('user:offline');
        disconnectSocket();
        setSocket(null);
        setIsConnected(false);
      };
    }
  }, [isAuthenticated, token, setUserOnline, setUserOffline]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
