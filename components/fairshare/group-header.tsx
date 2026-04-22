"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Copy, MoreHorizontal, UserPlus } from "lucide-react"

type Member = {
  id: string
  name: string
  color: string
  initial: string
}

interface GroupHeaderProps {
  groupName: string
  inviteCode: string
  members: Member[]
  subtitle?: string
  emoji?: string
}

export function GroupHeader({
  groupName,
  inviteCode,
  members,
  subtitle = "Voyage · Mars 2026",
  emoji = "🏖️",
}: GroupHeaderProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <header className="px-5 pt-2 pb-5">
      {/* Title row */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-2xl leading-none" aria-hidden>
              {emoji}
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              {subtitle}
            </p>
          </div>
          <h1 className="font-display text-[34px] leading-[1.02] font-bold text-balance tracking-tight text-foreground">
            {groupName}
          </h1>
        </div>
        <button
          className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-white border border-border shadow-sm active:scale-95 transition-transform"
          aria-label="Options du groupe"
        >
          <MoreHorizontal className="w-5 h-5 text-foreground/60" />
        </button>
      </div>

      {/* Members row + invite action */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2.5">
            {members.slice(0, 4).map((m) => (
              <div
                key={m.id}
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white border-[2.5px] border-background shadow-sm"
                style={{ backgroundColor: m.color }}
                title={m.name}
              >
                {m.initial}
              </div>
            ))}
            {members.length > 4 && (
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold bg-secondary border-[2.5px] border-background text-foreground/70 shadow-sm">
                +{members.length - 4}
              </div>
            )}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-semibold text-foreground">
              {members.length} membres
            </span>
            <span className="text-[11px] text-muted-foreground">
              Tous actifs
            </span>
          </div>
        </div>

        {/* Invite code pill */}
        <motion.button
          onClick={handleCopy}
          whileTap={{ scale: 0.97 }}
          className="group relative flex items-center gap-2 pl-2 pr-3 h-9 rounded-full bg-white border border-border shadow-sm hover:border-primary/50 transition-colors"
          aria-label="Copier le code d'invitation"
        >
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10">
            <UserPlus className="w-3 h-3 text-primary" strokeWidth={2.5} />
          </div>
          <span className="font-mono text-[13px] font-semibold tracking-[0.08em] text-foreground">
            {inviteCode}
          </span>
          <div className="relative w-3.5 h-3.5">
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 45 }}
                  transition={{ type: "spring", stiffness: 400, damping: 18 }}
                  className="absolute inset-0"
                >
                  <Check className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute inset-0"
                >
                  <Copy className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.button>
      </div>

      {/* Toast feedback */}
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute right-5 mt-2 text-[11px] font-semibold text-primary"
          >
            Code copié
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
