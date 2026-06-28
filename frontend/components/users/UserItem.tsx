import { User } from "@/types";
import { UserAvatar } from "./UserAvatar";

interface UserItemProps {
  user: User;
}

export function UserItem({ user }: UserItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-sidebar-hover transition-colors">
      <UserAvatar user={user} size="sm" showOnlineDot />
      <span className="truncate text-sm font-medium text-sidebar-text group-hover:text-text-main">
        {user.username}
      </span>
    </div>
  );
}
