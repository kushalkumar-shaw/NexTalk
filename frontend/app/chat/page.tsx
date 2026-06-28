"use client"

import { EmptyChatPlaceholder } from "@/components/chat/EmptyChatPlaceholder";

export default function ChatPage() {
  return <EmptyChatPlaceholder onBrowse={() => {
    // Optional: focus room search or open create modal
    const searchInput = document.querySelector('input[placeholder="Find a room..."]') as HTMLInputElement;
    if (searchInput) searchInput.focus();
  }} />;
}
