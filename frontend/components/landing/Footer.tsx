import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-sidebar-border bg-chat-bg py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-80">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-brand text-white">
              <Zap size={14} className="fill-current" />
            </div>
            <span className="font-bold text-text-main tracking-tight">NexTalk</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-sidebar-muted">
            <Link href="#" className="hover:text-text-main transition-colors">Features</Link>
            <Link href="#" className="hover:text-text-main transition-colors">Pricing</Link>
            <Link href="#" className="hover:text-text-main transition-colors">Documentation</Link>
            <Link href="#" className="hover:text-text-main transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-text-main transition-colors">Terms of Service</Link>
          </div>
        </div>
        
        <div className="mt-12 text-center text-xs text-sidebar-muted/60">
          <p>© {new Date().getFullYear()} NexTalk Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
