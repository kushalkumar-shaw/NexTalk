import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { userService } from '@/services/user.service';
import { roomService } from '@/services/room.service';
import { User, Room } from '@/types';
import { UserAvatar } from '../users/UserAvatar';
import toast from 'react-hot-toast';
import { Search, UserPlus } from 'lucide-react';
import { useRoomStore } from '@/store/useRoomStore';

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
}

export function AddMemberModal({ isOpen, onClose, room }: AddMemberModalProps) {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [addingUserId, setAddingUserId] = useState<string | null>(null);
  
  const { updateRoom } = useRoomStore();

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen, search]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const data = await userService.getUsers(search);
      // Filter out users already in the room
      const memberIds = Array.isArray(room.members) 
        ? room.members.map(m => typeof m === 'string' ? m : m._id) 
        : [];
      
      const availableUsers = data.users.filter(u => !memberIds.includes(u._id));
      setUsers(availableUsers);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (userId: string, username: string) => {
    try {
      setAddingUserId(userId);
      const updatedRoom = await roomService.addMemberToRoom(room._id, userId);
      // Update local state so it reflects immediately
      updateRoom(room._id, { members: updatedRoom.members });
      toast.success(`${username} added to the room`);
      // Re-load users to remove them from list
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add user');
    } finally {
      setAddingUserId(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Add to #${room.name}`}>
      <div className="space-y-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-sidebar-muted" />
          <Input 
            placeholder="Search users..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="max-h-60 overflow-y-auto pr-1 space-y-2 scrollbar-thin">
          {isLoading && users.length === 0 ? (
            <div className="text-center py-4 text-sidebar-muted">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="text-center py-4 text-sidebar-muted">No users found to add.</div>
          ) : (
            users.map(user => (
              <div 
                key={user._id} 
                className="flex items-center justify-between p-2 rounded-lg hover:bg-sidebar-hover transition-colors"
              >
                <div className="flex items-center gap-3">
                  <UserAvatar user={user} size="sm" />
                  <span className="font-medium text-text-main">{user.username}</span>
                </div>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleAddUser(user._id, user.username)}
                  disabled={addingUserId === user._id}
                  className="h-8 border-sidebar-border hover:bg-brand hover:text-white hover:border-brand"
                >
                  {addingUserId === user._id ? (
                    <span className="animate-spin mr-1">⚪</span>
                  ) : (
                    <UserPlus size={14} className="mr-1" />
                  )}
                  Add
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}
