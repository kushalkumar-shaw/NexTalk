"use client"

import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { cn } from "@/lib/utils";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileTab, setMobileTab] = useState<"chat" | "users" | "profile">("chat");

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-chat-bg">
      {/* Desktop Sidebar */}
      <Sidebar className="hidden md:flex" />

      {/* Mobile Sidebar (Users / Profile Views) */}
      <div className={cn(
        "absolute inset-0 z-30 bg-sidebar-bg md:hidden",
        mobileTab === "chat" ? "hidden" : "block"
      )}>
        {/* We can mount a simpler view here for mobile, but for now reuse sidebar partially or just show full sidebar if not chat */}
        <Sidebar className="w-full h-[calc(100dvh-64px)] border-none" />
      </div>

      {/* Main Content Area */}
      <main className={cn(
        "flex flex-1 flex-col h-full min-w-0 md:flex",
        mobileTab !== "chat" ? "hidden" : "flex"
      )}>
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </main>

      {/* Mobile Navigation */}
      <MobileNav activeTab={mobileTab} onTabChange={setMobileTab} />
    </div>
  );
}
