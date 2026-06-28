import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "online" | "offline" | "count" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        {
          "border-transparent bg-brand text-white": variant === "default",
          "border-transparent bg-online text-white": variant === "online",
          "border-transparent bg-offline text-white": variant === "offline",
          "border-transparent bg-amber-500 text-white min-w-[20px] justify-center px-1.5": variant === "count",
          "text-sidebar-text border-sidebar-border": variant === "outline",
        },
        className
      )}
      {...props}
    />
  )
}

export { Badge }
