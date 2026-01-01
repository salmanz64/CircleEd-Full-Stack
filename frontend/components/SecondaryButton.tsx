import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function SecondaryButton({
  className,
  ...props
}: ButtonProps) {
  return (
    <Button
      variant="outline"
      className={cn("border-2", className)}
      {...props}
    />
  )
}

