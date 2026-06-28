"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useRooms } from "@/hooks/useRooms";
import { Hash, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const roomSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(50, "Name must be less than 50 characters"),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
  type: z.enum(["public", "private"])
});

type RoomFormData = z.infer<typeof roomSchema>;

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const { createRoom } = useRooms();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "public"
    }
  });

  const selectedType = watch("type");

  const onSubmit = async (data: RoomFormData) => {
    setIsSubmitting(true);
    try {
      await createRoom(data.name, data.description || "", data.type);
      reset();
      onClose();
    } catch (error) {
      // Error handled in hook via toast
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create a Room" size="sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-sidebar-muted uppercase tracking-wider">
            Room Name <span className="text-red-500">*</span>
          </label>
          <Input 
            {...register("name")} 
            placeholder="e.g. general, frontend-team"
            error={errors.name?.message}
          />
        </div>
        
        <div>
          <label className="mb-1.5 block text-xs font-bold text-sidebar-muted uppercase tracking-wider">
            Description
          </label>
          <Input 
            {...register("description")} 
            placeholder="What's this room about?"
            error={errors.description?.message}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-sidebar-muted uppercase tracking-wider">
            Privacy
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setValue("type", "public")}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-md border p-3 transition-colors",
                selectedType === "public" 
                  ? "border-brand bg-brand/10 text-brand" 
                  : "border-sidebar-border bg-transparent text-sidebar-muted hover:border-sidebar-text"
              )}
            >
              <Hash size={24} />
              <span className="text-sm font-medium">Public</span>
            </button>
            <button
              type="button"
              onClick={() => setValue("type", "private")}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-md border p-3 transition-colors",
                selectedType === "private" 
                  ? "border-brand bg-brand/10 text-brand" 
                  : "border-sidebar-border bg-transparent text-sidebar-muted hover:border-sidebar-text"
              )}
            >
              <Lock size={24} />
              <span className="text-sm font-medium">Private</span>
            </button>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Create Room
          </Button>
        </div>
      </form>
    </Modal>
  );
}
