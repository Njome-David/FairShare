// components/fairshare/balance-hero.tsx
"use client"

import { motion } from "framer-motion"

interface BalanceHeroProps {
  netBalance: number
  currency?: string
}

export function BalanceHero({ netBalance, currency = "€" }: BalanceHeroProps) {
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
        className={`relative overflow-hidden rounded-3xl border border-black/[0.07] p-6 ${
          isCreditor ? "mesh-emerald" : "mesh-coral"
        }`}
      >
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
        </div>

        <div className="flex items-baseline gap-2">
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

        <p className="text-sm text-foreground/60 leading-relaxed mt-4">
          {isCreditor
            ? "Vos amis vous doivent de l'argent."
            : "Vous devez de l'argent à vos amis."}
        </p>
      </div>
    </motion.div>
  )
}