import { MessageSquare, ChevronDown } from "lucide-react";
import { ThemeToggle } from "../ui/ThemeToggle";

export function SidebarHeader() {
  return (
    <div className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border px-4 transition-colors hover:bg-sidebar-hover/30 cursor-pointer group">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand text-white shadow-sm group-hover:scale-105 transition-transform">
          <MessageSquare size={16} className="ml-0.5" />
        </div>
        <span className="font-heading font-bold text-lg text-text-main tracking-tight group-hover:text-brand transition-colors">NexTalk</span>
      </div>
      
      <button className="text-sidebar-muted hover:text-text-main p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all active:scale-95">
        <ThemeToggle />
      </button>
    </div>
  );
}
