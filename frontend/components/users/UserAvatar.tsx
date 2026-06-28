import Image from "next/image";
import { User } from "@/types";
import { cn, getInitials } from "@/lib/utils";

interface UserAvatarProps {
  user: Partial<User>;
  size?: "xs" | "sm" | "md" | "lg";
  showOnlineDot?: boolean;
}

const colors = [
  "bg-red-500", "bg-orange-500", "bg-amber-500", "bg-green-500",
  "bg-emerald-500", "bg-teal-500", "bg-cyan-500", "bg-blue-500",
  "bg-indigo-500", "bg-violet-500", "bg-purple-500", "bg-fuchsia-500",
  "bg-pink-500", "bg-rose-500"
];

function getStringHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function UserAvatar({ user, size = "md", showOnlineDot = false }: UserAvatarProps) {
  const isOnline = user.isOnline || false;
  const initials = getInitials(user.username || "?");
  
  const colorIndex = getStringHash(user.username || "unknown") % colors.length;
  const bgColor = colors[colorIndex];

  return (
    <div className="relative inline-block">
      <div 
        className={cn(
          "relative flex shrink-0 items-center justify-center rounded-full overflow-hidden text-text-main font-medium",
          bgColor,
          {
            "h-5 w-5 text-[10px]": size === "xs",
            "h-8 w-8 text-xs": size === "sm",
            "h-10 w-10 text-sm": size === "md",
            "h-12 w-12 text-base": size === "lg",
          }
        )}
      >
        {user.avatar ? (
          <Image 
            src={user.avatar} 
            alt={user.username || "User avatar"} 
            fill
            sizes="(max-width: 48px) 100vw"
            className="object-cover"
          />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      
      {showOnlineDot && (
        <span 
          className={cn(
            "absolute bottom-0 right-0 block rounded-full ring-2 ring-chat-bg",
            isOnline ? "bg-online" : "bg-offline",
            {
              "h-1.5 w-1.5": size === "xs",
              "h-2.5 w-2.5": size === "sm",
              "h-3 w-3": size === "md",
              "h-3.5 w-3.5": size === "lg",
            }
          )} 
        />
      )}
    </div>
  );
}
