"use client"

import { TypingUser } from "@/types";
import { cn } from "@/lib/utils";

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
}

export function TypingIndicator({ typingUsers }: TypingIndicatorProps) {
  if (typingUsers.length === 0) return null;

  let text = "";
  if (typingUsers.length === 1) {
    text = `${typingUsers[0].username} is typing...`;
  } else if (typingUsers.length === 2) {
    text = `${typingUsers[0].username} and ${typingUsers[1].username} are typing...`;
  } else {
    text = "Several people are typing...";
  }

  return (
    <div className="flex h-6 items-center px-6 text-xs font-medium text-sidebar-muted animate-fade-in mb-2">
      <span className="mr-2">{text}</span>
      <div className="flex items-center gap-1 mt-1">
        <div className="h-1.5 w-1.5 rounded-full bg-sidebar-muted animate-bounce-dot" style={{ animationDelay: "0s" }} />
        <div className="h-1.5 w-1.5 rounded-full bg-sidebar-muted animate-bounce-dot" style={{ animationDelay: "0.2s" }} />
        <div className="h-1.5 w-1.5 rounded-full bg-sidebar-muted animate-bounce-dot" style={{ animationDelay: "0.4s" }} />
      </div>
    </div>
  );
}
