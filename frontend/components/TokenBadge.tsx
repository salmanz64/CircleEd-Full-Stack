import { Coins } from "lucide-react"
import { cn } from "@/lib/utils"

interface TokenBadgeProps {
  amount: number
  variant?: "default" | "large" | "small"
  className?: string
}

export function TokenBadge({
  amount,
  variant = "default",
  className,
}: TokenBadgeProps) {
  const sizeClasses = {
    small: "text-xs px-2 py-1",
    default: "text-sm px-3 py-1.5",
    large: "text-base px-4 py-2",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold",
        sizeClasses[variant],
        className
      )}
    >
      <Coins className={cn("h-4 w-4", variant === "small" && "h-3 w-3")} />
      <span>{amount}</span>
    </div>
  )
}

