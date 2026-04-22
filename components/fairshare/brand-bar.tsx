// components/fairshare/brand-bar.tsx
"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ChevronLeft } from "lucide-react"

interface BrandBarProps {
  onBack?: () => void
}

export function BrandBar({ onBack }: BrandBarProps) {
  return (
    <div className="relative z-10 flex items-center justify-between px-5 pt-5 pb-3">
      <button
        onClick={onBack}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-border shadow-sm active:scale-95 transition-transform"
        aria-label="Retour"
      >
        <ChevronLeft className="w-5 h-5 text-foreground/70" />
      </button>

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

      {/* Espace vide pour équilibrer */}
      <div className="w-10 h-10" />
    </div>
  )
}