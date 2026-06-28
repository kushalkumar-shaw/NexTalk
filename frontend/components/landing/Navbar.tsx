"use client"

import Link from "next/link";
import { Zap } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { ThemeToggle } from "../ui/ThemeToggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
        scrolled ? "bg-chat-bg/80 backdrop-blur-md border-sidebar-border shadow-sm py-3" : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white shadow-lg shadow-brand/20">
            <Zap size={18} className="fill-current" />
          </div>
          <span className="font-bold text-xl text-text-main tracking-tight">NexTalk</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {!isLoading && (
            isAuthenticated ? (
              <Link href="/chat">
                <Button className="rounded-full px-6 font-semibold shadow-lg shadow-brand/20">
                  Go to Chat
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="hidden sm:block">
                  <Button variant="ghost" className="rounded-full font-medium hover:bg-white/5">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button className="rounded-full px-6 font-semibold shadow-lg shadow-brand/20">
                    Get Started
                  </Button>
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
}
