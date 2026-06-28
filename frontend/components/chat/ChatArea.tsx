"use client"

import { useMessages } from "@/hooks/useMessages";
import { useTyping } from "@/hooks/useTyping";
import { Room } from "@/types";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { TypingIndicator } from "./TypingIndicator";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import { useRoomStore } from "@/store/useRoomStore";
import { useRooms } from "@/hooks/useRooms";
import { Button } from "../ui/Button";

interface ChatAreaProps {
  room: Room;
}

export function ChatArea({ room }: ChatAreaProps) {
  const { 
    messages, 
    isLoading, 
    hasMore, 
    isFetchingMore, 
    loadMore, 
    sendMessage, 
    markRead 
  } = useMessages(room._id);
  
  const { typingUsers, startTyping, stopTyping } = useTyping(room._id);
  const { user } = useAuthStore();
  const { setActiveRoom } = useRoomStore();
  const { joinRoom } = useRooms();

  const isMember = user && Array.isArray(room.members) && 
    room.members.some(m => (typeof m === 'string' ? m : m._id) === user._id);

  useEffect(() => {
    setActiveRoom(room._id);
    return () => setActiveRoom(null);
  }, [room._id, setActiveRoom]);

  const handleSend = (content: string) => {
    if (user) {
      sendMessage(content, user._id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-chat-bg relative">
      <ChatHeader room={room} />
      
      <MessageList 
        messages={messages} 
        isLoading={isLoading} 
        hasMore={hasMore} 
        isFetchingMore={isFetchingMore} 
        loadMore={loadMore} 
        markRead={markRead}
      />
      
      <TypingIndicator typingUsers={typingUsers} />
      
      {!isMember ? (
        <div className="p-4 bg-chat-bg border-t border-sidebar-border mt-auto flex flex-col items-center justify-center py-6">
          <p className="text-sidebar-muted mb-3">You are previewing this public room.</p>
          <Button onClick={() => joinRoom(room._id)} className="rounded-full px-8 bg-brand hover:bg-brand-hover text-white">
            Join Room to Chat
          </Button>
        </div>
      ) : (
        <MessageInput 
          onSend={handleSend} 
          onTypingStart={startTyping} 
          onTypingStop={stopTyping} 
          placeholder={`Message #${room.name}`}
        />
      )}
    </div>
  );
}
