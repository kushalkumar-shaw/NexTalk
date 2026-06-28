import { Zap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-chat-bg p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-brand/5 blur-[100px]" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="mb-8 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-text-main shadow-lg">
            <Zap size={28} className="fill-current" />
          </div>
        </div>
        
        <div className="rounded-2xl border border-sidebar-border bg-[#2b2d31]/80 backdrop-blur-sm p-8 shadow-2xl">
          {children}
        </div>
        
        <div className="mt-8 text-center text-sm text-sidebar-muted">
          <p>© {new Date().getFullYear()} NexTalk. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
