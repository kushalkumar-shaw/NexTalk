"use client"

import { useState, useRef, useEffect } from "react";
import { Send, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSend: (content: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function MessageInput({ onSend, onTypingStart, onTypingStop, disabled, placeholder = "Message" }: MessageInputProps) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [content]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (e.target.value.length > 0) {
      onTypingStart();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (content.trim().length === 0 || disabled) return;
    
    onSend(content.trim());
    setContent("");
    onTypingStop();
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="p-4 bg-chat-bg border-t border-sidebar-border/50 mt-auto">
      <div className="relative flex items-end gap-2 bg-chat-input rounded-2xl px-4 py-2 ring-1 ring-sidebar-border/50 shadow-sm focus-within:ring-brand/50 focus-within:shadow-md transition-all duration-200">
        <button 
          className="mb-2 shrink-0 text-sidebar-muted hover:text-text-main transition-colors hover:scale-110 active:scale-95"
          title="Add emoji (coming soon)"
          disabled={disabled}
        >
          <Smile size={24} />
        </button>
        
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          rows={1}
          className="flex-1 max-h-[120px] resize-none bg-transparent py-2.5 text-text-main placeholder:text-sidebar-muted focus:outline-none scrollbar-thin"
        />
        
        {content.length > 1800 && (
          <span className="mb-2 shrink-0 text-xs text-amber-500 font-medium">
            {content.length}/2000
          </span>
        )}
        
        <button
          onClick={handleSend}
          disabled={disabled || content.trim().length === 0}
          className={cn(
            "mb-1.5 shrink-0 rounded-full p-2 transition-all flex items-center justify-center",
            content.trim().length > 0 && !disabled
              ? "bg-brand text-white hover:bg-brand-hover hover:scale-105 active:scale-95 shadow-sm"
              : "bg-transparent text-sidebar-muted"
          )}
        >
          <Send size={18} className={content.trim().length > 0 && !disabled ? "ml-0.5" : ""} />
        </button>
      </div>
    </div>
  );
}
