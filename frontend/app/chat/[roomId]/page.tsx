"use client"

import { useEffect, useState } from "react";
import { ChatArea } from "@/components/chat/ChatArea";
import { roomService } from "@/services/room.service";
import { Room } from "@/types";
import { Spinner } from "@/components/ui/Spinner";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useRoomStore } from "@/store/useRoomStore";

export default function RoomPage({ params }: { params: { roomId: string } }) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { rooms } = useRoomStore();

  useEffect(() => {
    const fetchRoom = async () => {
      setIsLoading(true);
      try {
        // First try to find it in the store cache
        const cachedRoom = rooms.find(r => r._id === params.roomId);
        if (cachedRoom) {
          setRoom(cachedRoom);
          setIsLoading(false);
          return;
        }
        
        // Otherwise fetch from API
        const data = await roomService.getRoomById(params.roomId);
        setRoom(data.room);
      } catch (error) {
        toast.error("Room not found");
        router.push("/chat");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, [params.roomId, router, rooms]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-chat-bg">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!room) return null;

  return <ChatArea room={room} />;
}
