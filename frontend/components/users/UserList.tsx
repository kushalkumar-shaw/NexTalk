import { User } from "@/types";
import { UserItem } from "./UserItem";

interface UserListProps {
  users: User[];
}

export function UserList({ users }: UserListProps) {
  if (users.length === 0) {
    return (
      <div className="px-2 py-4 text-sm text-sidebar-muted text-center">
        No users online
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5 mt-2">
      {users.map((user) => (
        <UserItem key={user._id} user={user} />
      ))}
    </div>
  );
}
