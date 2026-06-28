"use client"

import * as React from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg"
}

export function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/60 transition-opacity animate-fade-in" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className={cn(
          "relative z-50 w-full max-w-lg rounded-xl bg-chat-header shadow-2xl animate-slide-in",
          {
            "max-w-sm": size === "sm",
            "max-w-md": size === "md",
            "max-w-xl": size === "lg",
          }
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-sidebar-border p-4">
          <h2 className="text-lg font-semibold text-text-main">{title}</h2>
          <button 
            onClick={onClose}
            className="rounded-full p-1 text-sidebar-muted hover:bg-sidebar-hover hover:text-text-main transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
