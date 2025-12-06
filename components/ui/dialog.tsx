"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Y2K Nokia Edgy Dialog Component
 * Translucent cyber panels with glow effects
 */

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50",
        className
      )}
      style={{
        background: 'radial-gradient(ellipse at center, rgba(0, 229, 255, 0.05) 0%, rgba(4, 8, 16, 0.95) 100%)',
        backdropFilter: 'blur(4px)',
      }}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 p-6 duration-200 sm:max-w-lg",
          className
        )}
        style={{
          background: 'linear-gradient(135deg, rgba(0, 59, 122, 0.95) 0%, rgba(0, 20, 40, 0.98) 100%)',
          border: '2px solid rgba(0, 229, 255, 0.3)',
          boxShadow: '0 0 60px rgba(0, 229, 255, 0.2), 0 0 120px rgba(157, 0, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        }}
        {...props}
      >
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-6 h-6 pointer-events-none">
          <div className="absolute top-0 left-0 w-4 h-[2px] bg-[#00e5ff]" />
          <div className="absolute top-0 left-0 w-[2px] h-4 bg-[#00e5ff]" />
        </div>
        <div className="absolute top-0 right-0 w-6 h-6 pointer-events-none">
          <div className="absolute top-0 right-0 w-4 h-[2px] bg-[#ff00aa]" />
          <div className="absolute top-0 right-0 w-[2px] h-4 bg-[#ff00aa]" />
        </div>
        <div className="absolute bottom-0 left-0 w-6 h-6 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-4 h-[2px] bg-[#9d00ff]" />
          <div className="absolute bottom-0 left-0 w-[2px] h-4 bg-[#9d00ff]" />
        </div>
        <div className="absolute bottom-0 right-0 w-6 h-6 pointer-events-none">
          <div className="absolute bottom-0 right-0 w-4 h-[2px] bg-[#39ff14]" />
          <div className="absolute bottom-0 right-0 w-[2px] h-4 bg-[#39ff14]" />
        </div>

        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="absolute top-4 right-4 opacity-70 transition-all hover:opacity-100 hover:scale-110 focus:outline-none disabled:pointer-events-none group"
            style={{ color: '#00e5ff' }}
          >
            <XIcon className="w-5 h-5 group-hover:drop-shadow-[0_0_10px_#00e5ff]" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "text-lg leading-none font-semibold tracking-widest",
        className
      )}
      style={{
        color: '#00e5ff',
        textShadow: '0 0 15px rgba(0, 229, 255, 0.5)',
      }}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-sm tracking-wider", className)}
      style={{ color: '#c0c0c0' }}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
