import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function PrimaryButton({
  className,
  ...props
}: ButtonProps) {
  return (
    <Button
      className={cn("bg-primary hover:bg-primary/90 text-white", className)}
      {...props}
    />
  )
}

