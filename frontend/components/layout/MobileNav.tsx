"use client"

import { MessageSquare, Users, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  activeTab: "chat" | "users" | "profile";
  onTabChange: (tab: "chat" | "users" | "profile") => void;
}

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-sidebar-border bg-sidebar-bg pb-safe md:hidden">
      <button 
        onClick={() => onTabChange("chat")}
        className={cn(
          "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
          activeTab === "chat" ? "text-brand" : "text-sidebar-muted hover:text-sidebar-text"
        )}
      >
        <MessageSquare size={24} className={activeTab === "chat" ? "fill-current/20" : ""} />
        <span className="text-[10px] font-medium">Chat</span>
      </button>
      
      <button 
        onClick={() => onTabChange("users")}
        className={cn(
          "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
          activeTab === "users" ? "text-brand" : "text-sidebar-muted hover:text-sidebar-text"
        )}
      >
        <Users size={24} className={activeTab === "users" ? "fill-current/20" : ""} />
        <span className="text-[10px] font-medium">People</span>
      </button>

      <button 
        onClick={() => onTabChange("profile")}
        className={cn(
          "flex flex-col items-center justify-center w-full h-full gap-1 transition-colors",
          activeTab === "profile" ? "text-brand" : "text-sidebar-muted hover:text-sidebar-text"
        )}
      >
        <UserIcon size={24} className={activeTab === "profile" ? "fill-current/20" : ""} />
        <span className="text-[10px] font-medium">You</span>
      </button>
    </div>
  );
}
