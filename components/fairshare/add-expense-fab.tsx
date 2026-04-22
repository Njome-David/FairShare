"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"

export function AddExpenseFab() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Bottom sheet */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md rounded-t-3xl border-t border-border bg-background p-6 pb-8 shadow-[0_-8px_40px_rgba(0,0,0,0.12)]"
          >
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-5" />
            <h3 className="font-display font-bold text-2xl mb-1 tracking-tight text-foreground">
              Nouvelle depense
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Qui a paye quoi, pour qui ?
            </p>

            <div className="flex flex-col gap-3">
              <div className="p-4 rounded-2xl bg-white border border-border shadow-sm">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                  Montant
                </label>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-display font-bold text-4xl text-foreground tabular-nums">
                    0
                  </span>
                  <span className="font-display font-semibold text-2xl text-muted-foreground">
                    ,00 €
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {["🍕", "🚕", "🏠", "🎟️"].map((emoji) => (
                  <button
                    key={emoji}
                    className="aspect-square rounded-2xl bg-white border border-border shadow-sm hover:border-primary/40 hover:bg-primary/5 transition-all text-2xl active:scale-95"
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <button className="w-full h-12 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm active:scale-[0.98] transition-transform glow-emerald">
                Enregistrer la depense
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating FAB — centré au-dessus de la bottom nav */}
      <div className="fixed bottom-[34px] left-0 right-0 z-40 flex justify-center pointer-events-none">
        <div className="relative pointer-events-auto">
          {/* Outer breathing halo */}
          {!isOpen && (
            <motion.div
              animate={{
                scale: [1, 1.35, 1],
                opacity: [0.4, 0, 0.4],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 rounded-full bg-primary/40 blur-xl"
            />
          )}

          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.06 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
            className={`relative flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground glow-emerald glow-emerald-hover ${
              !isOpen ? "animate-breathe" : ""
            }`}
            aria-label={isOpen ? "Fermer" : "Ajouter une depense"}
          >
            <motion.div
              animate={{ rotate: isOpen ? 135 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Plus className="w-6 h-6" strokeWidth={2.75} />
            </motion.div>
          </motion.button>
        </div>
      </div>
    </>
  )
}
