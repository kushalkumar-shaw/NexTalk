"use client"

import React, { useEffect, useRef, useState } from "react";
import { Message } from "@/types";
import { MessageBubble } from "./MessageBubble";
import { Spinner } from "../ui/Spinner";
import { Skeleton } from "../ui/Skeleton";
import { isSameDay, formatDate } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  hasMore: boolean;
  isFetchingMore: boolean;
  loadMore: () => void;
  markRead: (id: string) => void;
}

export function MessageList({ messages, isLoading, hasMore, isFetchingMore, loadMore, markRead }: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const bottomSentinelRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const { user } = useAuthStore();
  
  // Track previous scroll height to maintain position when loading more
  const prevScrollHeightRef = useRef<number>(0);

  // Intersection Observer for infinite scroll (top)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingMore && !isLoading) {
          if (scrollRef.current) {
            prevScrollHeightRef.current = scrollRef.current.scrollHeight;
          }
          loadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (topSentinelRef.current) {
      observer.observe(topSentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isFetchingMore, isLoading, loadMore]);

  // Adjust scroll position after prepending messages
  useEffect(() => {
    if (isFetchingMore) return; // Wait until done
    if (scrollRef.current && prevScrollHeightRef.current > 0) {
      const newScrollHeight = scrollRef.current.scrollHeight;
      scrollRef.current.scrollTop = newScrollHeight - prevScrollHeightRef.current;
      prevScrollHeightRef.current = 0; // Reset
    }
  }, [messages.length, isFetchingMore]);

  // Scroll tracking to determine if we should auto-scroll
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    
    // If we're within 100px of the bottom, turn auto-scroll on, else off
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
    setAutoScroll(isAtBottom);
  };

  // Auto-scroll to bottom on new messages if autoScroll is true
  useEffect(() => {
    if (autoScroll && bottomSentinelRef.current) {
      bottomSentinelRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, autoScroll]);

  // Mark unread messages as read
  useEffect(() => {
    if (!user || messages.length === 0) return;
    
    // Find messages sent by others that we haven't read yet
    messages.forEach(msg => {
      if (msg.sender._id !== user._id && !msg.readBy.includes(user._id)) {
        // Debounce or batch this in a real app, but for now just call it
        markRead(msg._id);
      }
    });
  }, [messages, user, markRead]);

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 justify-end">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className="h-16 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div 
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin relative pb-4"
    >
      <div ref={topSentinelRef} className="h-4 w-full" />
      
      {isFetchingMore && (
        <div className="flex justify-center py-2">
          <Spinner size="sm" />
        </div>
      )}

      {messages.length === 0 && !isLoading ? (
        <div className="flex h-full items-center justify-center text-sidebar-muted">
          No messages yet. Say hello!
        </div>
      ) : (
        <div className="flex flex-col pb-2">
          {messages.map((message, index) => {
            const prevMessage = index > 0 ? messages[index - 1] : null;
            
            // Check if we need a date divider
            const showDateDivider = !prevMessage || !isSameDay(message.createdAt, prevMessage.createdAt);
            
            // Check if compact (same sender, within 5 mins, no date divider)
            let isCompact = false;
            if (prevMessage && !showDateDivider && prevMessage.sender._id === message.sender._id) {
              const timeDiff = new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime();
              isCompact = timeDiff < 5 * 60 * 1000; // 5 minutes
            }

            return (
              <React.Fragment key={message._id}>
                {showDateDivider && (
                  <div className="flex items-center justify-center my-4 relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <div className="w-full border-t border-sidebar-border" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-chat-bg px-3 text-xs font-semibold text-sidebar-muted rounded-full">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                  </div>
                )}
                
                <MessageBubble 
                  message={message} 
                  isCompact={isCompact} 
                />
              </React.Fragment>
            );
          })}
        </div>
      )}
      
      <div ref={bottomSentinelRef} className="h-1 w-full" />
    </div>
  );
}
