import { MessageSquare, Shield, Zap, Globe, Smartphone, Users } from "lucide-react";

export function Features() {
  const features = [
    {
      icon: <Zap size={24} className="text-amber-400" />,
      title: "Real-time WebSockets",
      description: "Experience zero-latency messaging with our robust Socket.io infrastructure. Messages appear instantly.",
      gradient: "from-amber-400/10 to-amber-400/5"
    },
    {
      icon: <Shield size={24} className="text-green-400" />,
      title: "Secure Authentication",
      description: "Your data is protected with HTTP-only cookies and JWT-based session management.",
      gradient: "from-green-400/10 to-green-400/5"
    },
    {
      icon: <Users size={24} className="text-brand" />,
      title: "Public & Private Rooms",
      description: "Create dedicated spaces for your teams or private channels for confidential conversations.",
      gradient: "from-brand/10 to-brand/5"
    },
    {
      icon: <MessageSquare size={24} className="text-purple-400" />,
      title: "Rich Messaging",
      description: "Read receipts, typing indicators, and optimistic UI updates make chatting feel incredibly responsive.",
      gradient: "from-purple-400/10 to-purple-400/5"
    },
    {
      icon: <Smartphone size={24} className="text-rose-400" />,
      title: "Mobile Optimized",
      description: "A flawless experience across all devices with a dedicated mobile navigation system.",
      gradient: "from-rose-400/10 to-rose-400/5"
    },
    {
      icon: <Globe size={24} className="text-cyan-400" />,
      title: "Dark Mode by Default",
      description: "Designed for late-night productivity with a sleek, carefully curated dark theme.",
      gradient: "from-cyan-400/10 to-cyan-400/5"
    }
  ];

  return (
    <section id="features" className="py-24 relative overflow-hidden bg-chat-bg">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-text-main mb-4">
            Everything you need to <span className="text-brand">collaborate</span>
          </h2>
          <p className="text-sidebar-muted md:text-lg">
            Built with modern web technologies to provide a seamless, native-feeling chat experience directly in your browser.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="group relative rounded-2xl border border-sidebar-border bg-sidebar-bg p-8 transition-all hover:border-brand/30 hover:shadow-xl hover:-translate-y-1"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl`} />
              <div className="relative z-10">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sidebar-bg border border-sidebar-border shadow-sm">
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-text-main">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-sidebar-muted">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
