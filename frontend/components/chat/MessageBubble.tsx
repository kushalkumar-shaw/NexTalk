"use client"

import { Message } from "@/types";
import { UserAvatar } from "../users/UserAvatar";
import { formatTime, cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import React from "react";

interface MessageBubbleProps {
  message: Message;
  isCompact?: boolean;
}

export function MessageBubble({ message, isCompact = false }: MessageBubbleProps) {
  const { user } = useAuthStore();
  const isOwn = user ? message.sender._id === user._id : false;
  
  // Is this a temporary optimistic message?
  const isTemp = message._id.startsWith('temp-');
  
  // Format content to make links clickable (simple approach)
  const formatContent = (content: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = content.split(urlRegex);
    
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            {part}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (isCompact) {
    return (
      <div className="group flex px-4 py-0.5 hover:bg-black/5 transition-colors relative">
        <div className="absolute left-4 top-0.5 w-[32px] text-right opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] text-sidebar-muted select-none">
            {formatTime(message.createdAt)}
          </span>
        </div>
        <div className="ml-[44px] flex-1 break-words text-text-main whitespace-pre-wrap leading-relaxed opacity-90">
          {formatContent(message.content)}
        </div>
        {isOwn && !isTemp && (
          <div className="shrink-0 ml-2 mt-1 text-sidebar-muted">
            {message.readBy.length > 1 ? (
              <CheckCheck size={14} className="text-brand" />
            ) : (
              <Check size={14} />
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn("group flex px-4 py-2 mt-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors", isTemp && "opacity-70")}>
      <div className="shrink-0 mr-3 mt-1">
        <UserAvatar user={message.sender} size="sm" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className={cn(
            "font-heading font-semibold text-base leading-none", 
            isOwn ? "text-brand" : "text-text-main"
          )}>
            {message.sender?.username || "Unknown"}
          </span>
          <span className="text-xs text-sidebar-muted font-medium">
            {formatTime(message.createdAt)}
          </span>
        </div>
        <div className={cn(
          "break-words whitespace-pre-wrap leading-relaxed inline-block max-w-[85%] px-4 py-2.5 rounded-2xl shadow-sm transition-all",
          isOwn 
            ? "bg-brand text-white rounded-tl-sm" 
            : "bg-chat-bubble text-text-main rounded-tr-sm border border-sidebar-border/30"
        )}>
          {formatContent(message.content)}
        </div>
      </div>
      {isOwn && !isTemp && (
        <div className="shrink-0 ml-3 mt-auto text-sidebar-muted self-end mb-2">
          {message.readBy.length > 1 ? (
            <CheckCheck size={14} className="text-brand" />
          ) : (
            <Check size={14} />
          )}
        </div>
      )}
    </div>
  );
}
