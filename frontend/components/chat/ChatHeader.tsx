"use client"

import { Room } from "@/types";
import { Hash, Lock, Users, LogOut, UserPlus } from "lucide-react";
import { useRooms } from "@/hooks/useRooms";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { AddMemberModal } from "../rooms/AddMemberModal";

interface ChatHeaderProps {
  room: Room;
}

export function ChatHeader({ room }: ChatHeaderProps) {
  const { leaveRoom } = useRooms();
  const { user } = useAuthStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const memberCount = Array.isArray(room.members) ? room.members.length : 0;
  const isMember = user && Array.isArray(room.members) && 
    room.members.some(m => (typeof m === 'string' ? m : m._id) === user._id);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-sidebar-border/50 bg-chat-bg/80 backdrop-blur-md sticky top-0 z-10 transition-colors">
      <div className="flex flex-col overflow-hidden">
        <div className="flex items-center gap-2">
          {room.type === "private" && (
            <span className="text-sidebar-muted shrink-0">
              <Lock size={18} />
            </span>
          )}
          <div className="min-w-0">
          <h2 className="truncate text-lg font-heading font-bold text-text-main leading-tight tracking-tight">
            # {room.name}
          </h2>
          </div>
        </div>
        {room.description && (
          <p className="truncate text-xs text-sidebar-muted mt-0.5">
            {room.description}
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-4 ml-4">
        <div className="flex items-center gap-1.5 text-sidebar-muted" title={`${memberCount} members`}>
          <Users size={16} />
          <span className="text-sm font-medium">{memberCount}</span>
        </div>
        
        {isMember && room.type === "private" && (
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 text-sidebar-muted hover:text-brand transition-colors"
            title="Add Member"
          >
            <UserPlus size={16} />
          </button>
        )}

        {isMember && (
          <button 
            onClick={() => leaveRoom(room._id)}
            className="flex items-center gap-1.5 text-sidebar-muted hover:text-red-500 transition-colors"
            title="Leave Room"
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
      
      {isAddModalOpen && (
        <AddMemberModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          room={room} 
        />
      )}
    </div>
  );
}
