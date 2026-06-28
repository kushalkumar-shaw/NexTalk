import { useEffect, useState, useCallback } from 'react';
import { useSocket } from '../contexts/SocketContext';
import { useMessageStore } from '../store/useMessageStore';
import { messageService } from '../services/message.service';
import { Message } from '../types';
import toast from 'react-hot-toast';

export const useMessages = (roomId: string | null) => {
  const { socket } = useSocket();
  const { 
    messagesByRoom, 
    paginationByRoom, 
    isFetchingMore, 
    setMessages, 
    prependMessages, 
    addMessage, 
    markAsRead,
    setFetchingMore
  } = useMessageStore();

  const [isLoading, setIsLoading] = useState(false);

  const messages = roomId ? messagesByRoom[roomId] || [] : [];
  const pagination = roomId ? paginationByRoom[roomId] : null;
  const hasMore = pagination ? pagination.hasMore : false;

  useEffect(() => {
    if (!roomId || !socket) return;

    const fetchInitialMessages = async () => {
      setIsLoading(true);
      try {
        const data = await messageService.getMessages(roomId, 1, 50);
        setMessages(roomId, data.messages.reverse(), data.pagination);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };

    socket.emit('room:join', { roomId });
    fetchInitialMessages();

    const handleNewMessage = (message: Message) => {
      const msgRoomId = typeof message.room === 'string' ? message.room : (message.room as any)?._id;
      if (msgRoomId === roomId) {
        addMessage(roomId, message);
      }
    };

    const handleReadReceipt = (data: { messageId: string; readBy: string }) => {
      markAsRead(roomId, data.messageId, data.readBy);
    };

    const handleConnect = () => {
      socket.emit('room:join', { roomId });
    };

    socket.on('message:new', handleNewMessage);
    socket.on('message:read_receipt', handleReadReceipt);
    socket.on('connect', handleConnect);

    return () => {
      socket.emit('room:leave', { roomId });
      socket.off('message:new', handleNewMessage);
      socket.off('message:read_receipt', handleReadReceipt);
      socket.off('connect', handleConnect);
    };
  }, [roomId, socket, setMessages, addMessage, markAsRead]);

  const loadMore = useCallback(async () => {
    if (!roomId || !hasMore || isFetchingMore || !pagination) return;
    
    setFetchingMore(true);
    try {
      const nextPage = pagination.currentPage + 1;
      const data = await messageService.getMessages(roomId, nextPage, 50);
      prependMessages(roomId, data.messages.reverse(), data.pagination);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load older messages');
    } finally {
      setFetchingMore(false);
    }
  }, [roomId, hasMore, isFetchingMore, pagination, prependMessages, setFetchingMore]);

  const sendMessage = useCallback((content: string, senderId: string) => {
    if (!roomId || !socket) return;
    
    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const tempMessage = {
      _id: tempId,
      content,
      sender: { _id: senderId } as any, // Only need ID for optimistic
      room: roomId,
      type: 'text' as const,
      readBy: [senderId],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    addMessage(roomId, tempMessage as Message);
    socket.emit('message:send', { roomId, content });
  }, [roomId, socket, addMessage]);

  const markRead = useCallback((messageId: string) => {
    if (!roomId || !socket) return;
    socket.emit('message:read', { messageId });
  }, [roomId, socket]);

  return {
    messages,
    isLoading,
    hasMore,
    isFetchingMore,
    loadMore,
    sendMessage,
    markRead
  };
};
