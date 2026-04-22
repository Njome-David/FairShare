"use client"

import { motion } from "framer-motion"
import { Receipt, Trash2 } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

// ✅ Ajout de l'interface Expense
interface Expense {
  id: string
  title: string
  emoji: string
  amount: number
  paidBy: { name: string; initial: string; color: string }
  splitCount: number
  date: string
  yourShare: number
  youArePayer: boolean
}

interface RecentExpensesProps {
  expenses: Expense[]
  currency?: string
  groupId: string
}

export function RecentExpenses({ expenses, currency = "€", groupId }: RecentExpensesProps) {
  const queryClient = useQueryClient()

  const deleteExpense = useMutation({
    mutationFn: async (expenseId: string) => {
      const res = await fetch(`/api/expenses/${expenseId}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Erreur suppression")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] })
      queryClient.invalidateQueries({ queryKey: ["balances", groupId] })
    },
  })

  const grouped = expenses.reduce<Record<string, Expense[]>>((acc, exp) => {
    if (!acc[exp.date]) acc[exp.date] = []
    acc[exp.date].push(exp)
    return acc
  }, {})

  return (
    <section className="px-5 pb-36">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
            <Receipt className="w-3.5 h-3.5 text-foreground/50" strokeWidth={2.25} />
          </div>
          <h2 className="font-display font-semibold text-lg tracking-tight text-foreground">
            Dépenses récentes
          </h2>
        </div>
        <button className="text-xs font-semibold text-primary hover:underline underline-offset-4">
          Voir tout
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date} className="flex flex-col gap-1.5">
            <p className="text-[10px] uppercase tracking-[0.14em] font-semibold text-foreground/60 px-1 mb-0.5">
              {date}
            </p>
            <div className="flex flex-col gap-1.5">
              {items.map((e, i) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 p-2.5 pr-1.5 rounded-2xl bg-white border border-border shadow-sm hover:border-primary/30 transition-colors active:scale-[0.99] group"
                >
                  <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-xl shrink-0">
                    {e.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-foreground truncate leading-tight">
                      {e.title}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-foreground/65 mt-1">
                      <span
                        className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                        style={{ backgroundColor: e.paidBy.color }}
                      >
                        {e.paidBy.initial}
                      </span>
                      <span className="truncate">
                        {e.paidBy.name} a payé · /{e.splitCount}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-display font-semibold text-[15px] tabular-nums text-foreground leading-tight">
                      {e.amount.toFixed(2)}{currency}
                    </p>
                    <p
                      className={`text-[11px] font-semibold tabular-nums mt-0.5 ${
                        e.youArePayer ? "text-primary" : "text-destructive"
                      }`}
                    >
                      {e.youArePayer ? "+" : "−"}{e.yourShare.toFixed(2)}{currency}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteExpense.mutate(e.id)}
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    aria-label="Supprimer la dépense"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}