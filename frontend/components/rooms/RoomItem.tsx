"use client"

import { Room } from "@/types";
import { cn } from "@/lib/utils";
import { Lock, Hash } from "lucide-react";
import { Badge } from "../ui/Badge";
import { useMessageStore } from "@/store/useMessageStore";
import { useAuthStore } from "@/store/useAuthStore";

interface RoomItemProps {
  room: Room;
  isActive: boolean;
  onClick: () => void;
}

export function RoomItem({ room, isActive, onClick }: RoomItemProps) {
  const { messagesByRoom } = useMessageStore();
  const { user } = useAuthStore();
  
  // Calculate unread messages (simple approach for demo, usually tracked via server)
  const roomMessages = messagesByRoom[room._id] || [];
  const unreadCount = user ? roomMessages.filter(m => !m.readBy.includes(user._id)).length : 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm font-medium transition-colors animate-slide-in",
        {
          "bg-sidebar-active text-white": isActive,
          "text-sidebar-text hover:bg-sidebar-hover hover:text-text-main": !isActive,
        }
      )}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <span className="text-sidebar-muted shrink-0">
          {room.type === "private" ? <Lock size={16} /> : <Hash size={16} />}
        </span>
        <span className="truncate">{room.name}</span>
      </div>
      
      {unreadCount > 0 && (
        <Badge variant="count">{unreadCount > 99 ? '99+' : unreadCount}</Badge>
      )}
    </button>
  );
}
