"use client"

import { LogOut, Settings } from "lucide-react";
import { UserAvatar } from "../users/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import toast from "react-hot-toast";

export function ProfileSection() {
  const { user } = useAuthStore();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast("See you later!", { icon: "👋" });
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  if (!user) return null;

  return (
    <div className="mt-auto flex items-center justify-between border-t border-sidebar-border bg-sidebar-bg p-3 transition-colors hover:bg-sidebar-hover">
      <div className="flex items-center gap-2 overflow-hidden">
        <UserAvatar user={user} size="sm" showOnlineDot />
        <div className="flex flex-col overflow-hidden">
          <span className="truncate text-sm font-semibold text-text-main">{user.username}</span>
          <span className="truncate text-xs text-sidebar-muted">{user.email}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button 
          className="rounded p-1.5 text-sidebar-muted hover:bg-sidebar-hover hover:text-text-main transition-colors"
          title="Settings"
        >
          <Settings size={18} />
        </button>
        <button 
          onClick={handleLogout}
          className="rounded p-1.5 text-sidebar-muted hover:bg-red-500/10 hover:text-red-500 transition-colors"
          title="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}
