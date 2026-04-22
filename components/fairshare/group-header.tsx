// components/fairshare/group-header.tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, Copy, UserPlus, Users } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

type Member = {
  id: string
  name: string
  initial: string
  color: string
}

interface GroupHeaderProps {
  groupName: string
  inviteCode: string
  members: Member[]
  totalSpent?: number
}

export function GroupHeader({
  groupName,
  inviteCode,
  members,
  totalSpent,
}: GroupHeaderProps) {
  const [copied, setCopied] = useState(false)
  const [showMembers, setShowMembers] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <header className="px-5 pt-2 pb-5">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary mb-2">
            Total dépensé · {Math.round(totalSpent ?? 0).toLocaleString()} FCFA
          </p>
          <h1 className="font-display text-[34px] leading-[1.02] font-bold text-balance tracking-tight text-foreground">
            {groupName}
          </h1>
        </div>
        {/* Bouton 3 points retiré */}
      </div>

      {/* Members row + invite */}
      <div className="flex items-center justify-between gap-3">
        <Dialog open={showMembers} onOpenChange={setShowMembers}>
          <DialogTrigger asChild>
            <button className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
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
              <span className="text-[13px] font-semibold text-foreground">
                {members.length} membres
              </span>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Membres du groupe</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 mt-4">
              {members.map((m) => (
                <div key={m.id} className="flex items-center gap-3 p-2 rounded-lg">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ backgroundColor: m.color }}
                  >
                    {m.initial}
                  </div>
                  <span className="font-medium">{m.name}</span>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Invite code pill avec toast intégré */}
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
          {/* Toast "copié" inline */}
          <AnimatePresence>
            {copied && (
              <motion.span
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="absolute left-1/2 -translate-x-1/2 -bottom-6 text-[10px] font-semibold text-primary whitespace-nowrap"
              >
                Copié !
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </header>
  )
}