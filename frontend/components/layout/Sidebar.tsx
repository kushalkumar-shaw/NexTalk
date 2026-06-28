"use client"

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus } from "lucide-react";
import { SidebarHeader } from "./SidebarHeader";
import { ProfileSection } from "./ProfileSection";
import { RoomList } from "../rooms/RoomList";
import { RoomSearch } from "../rooms/RoomSearch";
import { CreateRoomModal } from "../rooms/CreateRoomModal";
import { UserList } from "../users/UserList";
import { Badge } from "../ui/Badge";
import { useRooms } from "@/hooks/useRooms";
import { useUsers } from "@/hooks/useUsers";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const router = useRouter();
  const { rooms, activeRoomId, setActiveRoom, isLoading: loadingRooms } = useRooms();
  const { onlineUsers, isLoading: loadingUsers } = useUsers();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredRooms = rooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside className={cn("flex h-full w-64 flex-col bg-sidebar-bg border-r border-sidebar-border shadow-sm", className)}>
      <SidebarHeader />
      
      <div className="flex-1 overflow-y-auto scrollbar-thin py-3">
        {/* Rooms Section */}
        <div className="mb-6">
          <div className="px-4 mb-2 flex items-center justify-between group">
            <h2 className="text-xs font-bold text-sidebar-muted uppercase tracking-wider group-hover:text-sidebar-text transition-colors">
              Rooms
            </h2>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="text-sidebar-muted hover:text-text-main p-0.5 rounded transition-colors"
              title="Create Room"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <RoomSearch value={searchQuery} onChange={setSearchQuery} />
          
          <div className="px-2">
            <RoomList 
              rooms={filteredRooms} 
              activeRoomId={activeRoomId}
              onRoomSelect={(id) => {
                setActiveRoom(id);
                router.push(`/chat/${id}`);
              }}
              isLoading={loadingRooms}
            />
          </div>
        </div>

        {/* Online Users Section */}
        <div>
          <div className="px-4 mb-2 flex items-center gap-2">
            <h2 className="text-xs font-bold text-sidebar-muted uppercase tracking-wider">
              Direct Messages
            </h2>
            {!loadingUsers && onlineUsers.length > 0 && (
              <Badge variant="outline" className="text-[10px] py-0 px-1.5 bg-sidebar-bg">
                {onlineUsers.length} Online
              </Badge>
            )}
          </div>
          <div className="px-2">
            <UserList users={onlineUsers} />
          </div>
        </div>
      </div>

      <ProfileSection />
      
      <CreateRoomModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </aside>
  );
}
