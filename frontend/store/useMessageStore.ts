import { create } from 'zustand';
import { Message, Pagination } from '../types';

interface MessageState {
  messagesByRoom: Record<string, Message[]>;
  paginationByRoom: Record<string, Pagination>;
  isFetchingMore: boolean;
  setMessages: (roomId: string, messages: Message[], pagination: Pagination) => void;
  prependMessages: (roomId: string, messages: Message[], pagination: Pagination) => void;
  addMessage: (roomId: string, message: Message) => void;
  markAsRead: (roomId: string, messageId: string, userId: string) => void;
  clearRoom: (roomId: string) => void;
  setFetchingMore: (isFetchingMore: boolean) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  messagesByRoom: {},
  paginationByRoom: {},
  isFetchingMore: false,
  setMessages: (roomId, messages, pagination) => set((state) => ({
    messagesByRoom: { ...state.messagesByRoom, [roomId]: messages },
    paginationByRoom: { ...state.paginationByRoom, [roomId]: pagination }
  })),
  prependMessages: (roomId, messages, pagination) => set((state) => ({
    messagesByRoom: { 
      ...state.messagesByRoom, 
      [roomId]: [...messages, ...(state.messagesByRoom[roomId] || [])]
    },
    paginationByRoom: { ...state.paginationByRoom, [roomId]: pagination }
  })),
  addMessage: (roomId, message) => set((state) => {
    const currentMessages = state.messagesByRoom[roomId] || [];
    // Handle optimistic update: if message with same temp ID exists, replace it
    const existingIndex = currentMessages.findIndex((m) => m._id === message._id || (m._id.startsWith('temp-') && m.content === message.content));
    
    if (existingIndex >= 0) {
      const newMessages = [...currentMessages];
      newMessages[existingIndex] = message;
      return { messagesByRoom: { ...state.messagesByRoom, [roomId]: newMessages } };
    }
    
    return { messagesByRoom: { ...state.messagesByRoom, [roomId]: [...currentMessages, message] } };
  }),
  markAsRead: (roomId, messageId, userId) => set((state) => {
    const currentMessages = state.messagesByRoom[roomId] || [];
    const newMessages = currentMessages.map((msg) => {
      if (msg._id === messageId && !msg.readBy.includes(userId)) {
        return { ...msg, readBy: [...msg.readBy, userId] };
      }
      return msg;
    });
    return { messagesByRoom: { ...state.messagesByRoom, [roomId]: newMessages } };
  }),
  clearRoom: (roomId) => set((state) => {
    const newMessages = { ...state.messagesByRoom };
    const newPagination = { ...state.paginationByRoom };
    delete newMessages[roomId];
    delete newPagination[roomId];
    return { messagesByRoom: newMessages, paginationByRoom: newPagination };
  }),
  setFetchingMore: (isFetchingMore) => set({ isFetchingMore })
}));
