import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Y2K Nokia Edgy Button Variants
 * Chrome bevels, translucent effects, cyber glow
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: [
          "bg-gradient-to-b from-[#003b7a] via-[#001a33] to-[#003b7a]",
          "text-[#00e5ff]",
          "border-2 border-[#00e5ff]/50",
          "shadow-[0_4px_0_rgba(0,0,0,0.5),0_0_20px_rgba(0,229,255,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]",
          "hover:bg-gradient-to-b hover:from-[#00e5ff]/20 hover:via-[#003b7a] hover:to-[#001a33]",
          "hover:shadow-[0_4px_0_rgba(0,0,0,0.5),0_0_30px_rgba(0,229,255,0.4),inset_0_1px_0_rgba(255,255,255,0.2)]",
          "hover:text-[#39ff14]",
          "active:translate-y-[3px] active:shadow-[0_1px_0_rgba(0,0,0,0.5),0_0_10px_rgba(0,229,255,0.2)]",
        ].join(" "),
        destructive: [
          "bg-gradient-to-b from-[#7a0020] via-[#330010] to-[#7a0020]",
          "text-[#ff0055]",
          "border-2 border-[#ff0055]/50",
          "shadow-[0_4px_0_rgba(0,0,0,0.5),0_0_20px_rgba(255,0,85,0.2),inset_0_1px_0_rgba(255,255,255,0.1)]",
          "hover:shadow-[0_4px_0_rgba(0,0,0,0.5),0_0_30px_rgba(255,0,85,0.4)]",
          "active:translate-y-[3px]",
        ].join(" "),
        outline: [
          "bg-transparent",
          "text-[#00e5ff]",
          "border-2 border-[#00e5ff]/30",
          "hover:bg-[#00e5ff]/10",
          "hover:border-[#00e5ff]/50",
          "hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]",
          "active:bg-[#00e5ff]/20",
        ].join(" "),
        secondary: [
          "bg-gradient-to-b from-[rgba(0,30,60,0.8)] to-[rgba(0,20,40,0.9)]",
          "text-[#c0c0c0]",
          "border-2 border-[#333]",
          "shadow-[0_2px_0_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]",
          "hover:text-[#00e5ff]",
          "hover:border-[#00e5ff]/30",
          "active:translate-y-[2px]",
        ].join(" "),
        ghost: [
          "bg-transparent",
          "text-[#c0c0c0]",
          "hover:text-[#00e5ff]",
          "hover:bg-[#00e5ff]/5",
        ].join(" "),
        link: [
          "text-[#00e5ff]",
          "underline-offset-4",
          "hover:underline",
          "hover:text-[#39ff14]",
        ].join(" "),
        chrome: [
          "bg-gradient-to-b from-[#e8e8e8] via-[#a0a0a0] to-[#e8e8e8]",
          "text-[#003b7a]",
          "border-3 border-outset border-[#c0c0c0]",
          "shadow-[4px_4px_0_rgba(0,0,0,0.4),inset_2px_2px_0_rgba(255,255,255,0.5),inset_-2px_-2px_0_rgba(0,0,0,0.2)]",
          "hover:from-[#ffffff] hover:via-[#c0c0c0] hover:to-[#ffffff]",
          "active:border-inset active:shadow-[1px_1px_0_rgba(0,0,0,0.4),inset_-2px_-2px_0_rgba(255,255,255,0.3),inset_2px_2px_0_rgba(0,0,0,0.2)]",
          "active:translate-x-[2px] active:translate-y-[2px]",
        ].join(" "),
        cyber: [
          "bg-gradient-to-r from-[#003b7a] via-[#9d00ff] to-[#ff00aa]",
          "text-white",
          "border-2 border-[#ff00aa]",
          "shadow-[0_0_20px_rgba(255,0,170,0.3),0_0_40px_rgba(157,0,255,0.2)]",
          "hover:shadow-[0_0_30px_rgba(255,0,170,0.5),0_0_60px_rgba(157,0,255,0.3)]",
          "active:scale-95",
        ].join(" "),
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        xl: "h-14 px-10 text-lg",
        icon: "size-10",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
