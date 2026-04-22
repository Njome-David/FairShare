"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react"

interface BalanceHeroProps {
  netBalance: number
  currency?: string
  totalOwedToYou: number
  totalYouOwe: number
}

export function BalanceHero({
  netBalance,
  currency = "€",
  totalOwedToYou,
  totalYouOwe,
}: BalanceHeroProps) {
  const isCreditor = netBalance >= 0
  const absBalance = Math.abs(netBalance)

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="mx-5 mb-6"
    >
      <div
        className={`relative overflow-hidden rounded-3xl border border-black/[0.07] p-6 grain shadow-sm ${
          isCreditor ? "mesh-emerald" : "mesh-coral"
        }`}
      >
        {/* Status label */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isCreditor ? "bg-primary" : "bg-destructive"
              } animate-pulse`}
            />
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-foreground/60">
              {isCreditor ? "On te doit" : "Tu dois"}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-foreground/50">
            <Sparkles className="w-3 h-3" />
            <span>{"Mis à jour à l'instant"}</span>
          </div>
        </div>

        {/* Big amount — Neo-Grotesque */}
        <div className="flex items-baseline gap-2 mb-5">
          <span
            className={`font-display font-bold text-[56px] leading-none tracking-tight tabular-nums ${
              isCreditor ? "text-primary" : "text-destructive"
            }`}
          >
            {absBalance.toFixed(2)}
          </span>
          <span
            className={`font-display font-semibold text-3xl ${
              isCreditor ? "text-primary/70" : "text-destructive/70"
            }`}
          >
            {currency}
          </span>
        </div>

        {/* Friendly message */}
        <p className="text-sm text-foreground/60 leading-relaxed mb-5 text-pretty">
          {isCreditor
            ? "Tes potes te remboursent bientôt. En attendant, paie-toi un café ☕"
            : "Pas de panique ! 2 virements et c'est réglé 🎯"}
        </p>

        {/* Breakdown pills */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-black/[0.05]">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <ArrowDownRight className="w-4 h-4 text-primary" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-foreground/60 font-semibold mb-0.5">
                A recevoir
              </p>
              <p className="font-display font-semibold text-base tabular-nums text-foreground">
                {totalOwedToYou.toFixed(2)}{currency}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-black/[0.05]">
            <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <ArrowUpRight className="w-4 h-4 text-destructive" strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-foreground/60 font-semibold mb-0.5">
                A payer
              </p>
              <p className="font-display font-semibold text-base tabular-nums text-foreground">
                {totalYouOwe.toFixed(2)}{currency}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
