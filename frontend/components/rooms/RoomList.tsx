import { Room } from "@/types";
import { RoomItem } from "./RoomItem";
import { Skeleton } from "../ui/Skeleton";

interface RoomListProps {
  rooms: Room[];
  activeRoomId: string | null;
  onRoomSelect: (roomId: string) => void;
  isLoading?: boolean;
}

export function RoomList({ rooms, activeRoomId, onRoomSelect, isLoading }: RoomListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 mt-2 px-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  if (rooms.length === 0) {
    return (
      <div className="px-2 py-4 text-sm text-sidebar-muted text-center">
        No rooms found
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5 mt-2">
      {rooms.map((room) => (
        <RoomItem
          key={room._id}
          room={room}
          isActive={room._id === activeRoomId}
          onClick={() => onRoomSelect(room._id)}
        />
      ))}
    </div>
  );
}
