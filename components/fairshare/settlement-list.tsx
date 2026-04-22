"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, Zap } from "lucide-react"

type Settlement = {
  id: string
  from: { name: string; initial: string; color: string }
  to: { name: string; initial: string; color: string }
  amount: number
  emoji?: string
}

interface SettlementListProps {
  settlements: Settlement[]
  currency?: string
  originalTransactionCount?: number
}

export function SettlementList({
  settlements,
  currency = "FCFA",
  originalTransactionCount = 12,
}: SettlementListProps) {
  const [settled, setSettled] = useState<Set<string>>(new Set())

  const handleSettle = (id: string) => {
    setSettled((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const remaining = settlements.length - settled.size
  const progress = (settled.size / settlements.length) * 100

  return (
    <section className="px-5 mb-6">
      {/* Section header — gamified */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-primary" strokeWidth={2.5} fill="currentColor" />
          </div>
          <h2 className="font-display font-semibold text-lg tracking-tight text-foreground">
            Réglé en {settlements.length} virements
          </h2>
        </div>
        <span className="text-xs text-foreground/60 font-medium">
          au lieu de {originalTransactionCount}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4 px-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] uppercase tracking-wider text-foreground/65 font-semibold">
            Progression
          </span>
          <span className="text-[11px] font-semibold text-primary tabular-nums">
            {settled.size} / {settlements.length}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="h-full bg-gradient-to-r from-primary/80 to-primary rounded-full"
            style={{ boxShadow: "0 0 8px rgba(0, 165, 80, 0.4)" }}
          />
        </div>
      </div>

      {/* Settlement cards */}
      <div className="flex flex-col gap-2.5">
        <AnimatePresence initial={false}>
          {settlements.map((s, i) => {
            const isSettled = settled.has(s.id)
            return (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                className={`group relative overflow-hidden rounded-2xl border transition-all ${
                  isSettled
                    ? "bg-primary/5 border-primary/20"
                    : "bg-white border-border shadow-sm hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-3 p-3.5">
                  {/* From → To avatars */}
                  <div className="flex items-center shrink-0">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-background"
                      style={{ backgroundColor: s.from.color }}
                    >
                      {s.from.initial}
                    </div>
                    <div className="relative mx-1">
                      <ArrowRight
                        className={`w-3.5 h-3.5 ${
                          isSettled ? "text-primary/50" : "text-foreground/50"
                        }`}
                        strokeWidth={2.5}
                      />
                    </div>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-background"
                      style={{ backgroundColor: s.to.color }}
                    >
                      {s.to.initial}
                    </div>
                  </div>

                  {/* Names + emoji context */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        isSettled ? "line-through text-foreground/50" : "text-foreground"
                      }`}
                    >
                      <span className="text-foreground/70">{s.from.name}</span>
                      <span className="text-foreground/50 mx-1.5">→</span>
                      <span>{s.to.name}</span>
                    </p>
                    <p className="text-xs text-foreground/65 mt-0.5">
                      {s.emoji} {isSettled ? "Réglé, bravo !" : "Virement suggéré"}
                    </p>
                  </div>

                  {/* Amount */}
                  <div className="text-right shrink-0">
                    <p
                      className={`font-display font-bold text-base tabular-nums transition-colors ${
                        isSettled ? "text-muted-foreground line-through" : "text-foreground"
                      }`}
                    >
                      {Math.round(s.amount).toLocaleString()} {currency}
                    </p>
                  </div>

                  {/* Action button */}
                  <button
                    onClick={() => handleSettle(s.id)}
                    className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                      isSettled
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                    aria-label={isSettled ? "Annuler" : "Marquer comme paye"}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={isSettled ? "done" : "todo"}
                        initial={{ scale: 0, rotate: -90 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Check className="w-4 h-4" strokeWidth={3} />
                      </motion.div>
                    </AnimatePresence>
                  </button>
                </div>

                {/* Celebratory glow on settle */}
                {isSettled && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute top-0 right-0 w-32 h-full pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle at top right, rgba(0, 165, 80, 0.12), transparent 70%)",
                    }}
                  />
                )}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Completion celebration */}
      <AnimatePresence>
        {remaining === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-4 rounded-2xl bg-primary/8 border border-primary/20 text-center shadow-sm"
          >
            <p className="text-2xl mb-1">🎉</p>
            <p className="font-display font-semibold text-primary">Tout est réglé !</p>
            <p className="text-xs text-foreground/70 mt-1">
              Le groupe est a zero. Prochaine activité ?
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
