import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/Button";
import { ArrowRight, MessageSquare, Shield, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-brand/10 blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px] -z-10" />
      
      <div className="container mx-auto px-4 md:px-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sidebar-border/50 border border-sidebar-border backdrop-blur-sm mb-8 animate-fade-in text-xs font-medium text-sidebar-muted">
          <span className="flex h-2 w-2 rounded-full bg-brand animate-pulse"></span>
          NexTalk 1.0 is now live
        </div>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-text-main tracking-tight mb-6 animate-slide-in" style={{ animationDuration: '0.4s' }}>
          Connect. Collaborate. <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-purple-400">
            Create.
          </span>
        </h1>
        
        <p className="mt-6 text-lg md:text-xl text-sidebar-muted max-w-2xl mx-auto mb-10 animate-slide-in" style={{ animationDuration: '0.5s', animationFillMode: 'both' }}>
          The next-generation real-time communication platform designed for modern teams. Secure, fast, and beautifully crafted.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 animate-slide-in" style={{ animationDuration: '0.6s', animationFillMode: 'both' }}>
          <Link href="/auth/register">
            <Button size="lg" className="rounded-full px-8 h-14 text-base shadow-xl shadow-brand/20 group">
              Start Chatting for Free
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <a href="#features">
            <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base border-sidebar-border bg-sidebar-bg/50 backdrop-blur-sm hover:bg-sidebar-hover">
              View Features
            </Button>
          </a>
        </div>
        
        {/* Mockup Image */}
        <div className="relative max-w-5xl mx-auto animate-float">
          {/* Glow behind image */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand/20 to-purple-500/20 blur-3xl rounded-full scale-90 -z-10" />
          
          <div className="rounded-2xl md:rounded-[2rem] border border-sidebar-border bg-chat-bg/80 backdrop-blur-xl p-2 md:p-4 shadow-2xl shadow-black/20 overflow-hidden ring-1 ring-sidebar-border/50">
            <div className="relative aspect-[16/9] rounded-xl md:rounded-2xl overflow-hidden bg-chat-bg">
              <Image 
                src="/hero-mockup.png" 
                alt="NexTalk Interface Mockup" 
                fill 
                className="object-cover object-top"
                priority
              />
              
              {/* Overlay gradient to blend bottom */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-chat-bg to-transparent" />
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
}
