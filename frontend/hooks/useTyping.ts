import { useEffect, useState, useCallback, useRef } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { TypingUser } from '../types';

export const useTyping = (roomId: string | null) => {
  const { socket } = useSocket();
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const stopTypingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!roomId || !socket) return;

    const handleTypingUpdate = (data: { roomId: string; user: TypingUser; isTyping: boolean }) => {
      if (data.roomId !== roomId) return;

      setTypingUsers((prev) => {
        if (data.isTyping) {
          if (!prev.find((u) => u._id === data.user._id)) {
            return [...prev, data.user];
          }
          return prev;
        } else {
          return prev.filter((u) => u._id !== data.user._id);
        }
      });
    };

    socket.on('typing:update', handleTypingUpdate);

    return () => {
      socket.off('typing:update', handleTypingUpdate);
      setTypingUsers([]);
    };
  }, [roomId, socket]);

  const startTyping = useCallback(() => {
    if (!roomId || !socket) return;
    
    socket.emit('typing:start', { roomId });

    if (stopTypingTimeoutRef.current) {
      clearTimeout(stopTypingTimeoutRef.current);
    }

    stopTypingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing:stop', { roomId });
    }, 2000);
  }, [roomId, socket]);

  const stopTyping = useCallback(() => {
    if (!roomId || !socket) return;
    
    if (stopTypingTimeoutRef.current) {
      clearTimeout(stopTypingTimeoutRef.current);
    }
    socket.emit('typing:stop', { roomId });
  }, [roomId, socket]);

  return {
    typingUsers,
    startTyping,
    stopTyping
  };
};
