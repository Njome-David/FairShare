"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Bell, ChevronLeft } from "lucide-react"

interface BrandBarProps {
  onBack?: () => void
  unreadCount?: number
}

export function BrandBar({ onBack, unreadCount = 2 }: BrandBarProps) {
  return (
    <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-3">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-border shadow-sm active:scale-95 transition-transform"
        aria-label="Retour"
      >
        <ChevronLeft className="w-5 h-5 text-foreground/70" />
      </button>

      {/* Logo carré — fond identique au fond de l'app pour continuité visuelle */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex items-center justify-center w-12 h-12 rounded-xl overflow-hidden shadow-[0_4px_16px_rgba(0,165,80,0.18)] ring-1 ring-black/[0.06]"
        style={{ backgroundColor: '#F2F4F2' }}
        aria-label="FairShare"
      >
        <Image
          src="/fairshare-logo.svg"
          alt="FairShare"
          width={48}
          height={48}
          className="w-full h-full object-cover"
          priority
        />
      </motion.div>

      {/* Notifications */}
      <button
        className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white border border-border shadow-sm active:scale-95 transition-transform"
        aria-label={`Notifications (${unreadCount} non lues)`}
      >
        <Bell className="w-[18px] h-[18px] text-foreground/70" strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary ring-2 ring-background animate-pulse" />
        )}
      </button>
    </div>
  )
}
