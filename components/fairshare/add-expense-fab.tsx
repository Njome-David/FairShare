// components/fairshare/add-expense-fab.tsx
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useUser } from "@/contexts/user-context"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface Member {
  id: string
  name: string
  initial: string
  color: string
}

interface AddExpenseFabProps {
  groupId: string
  members: Member[]
}

export function AddExpenseFab({ groupId, members }: AddExpenseFabProps) {
  const { user } = useUser()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [payerId, setPayerId] = useState(user?.id || "")
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])
  const [amountError, setAmountError] = useState("")

  const createExpense = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Erreur création dépense")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group", groupId] })
      queryClient.invalidateQueries({ queryKey: ["balances", groupId] })
      setOpen(false)
      resetForm()
    },
  })

  const resetForm = () => {
    setDescription("")
    setAmount("")
    setPayerId(user?.id || "")
    setSelectedParticipants([])
    setAmountError("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation du montant
    const rawAmount = parseFloat(amount)
    if (isNaN(rawAmount) || rawAmount <= 0) {
      setAmountError("Le montant doit être supérieur à 0")
      return
    }

    // Vérification multiple de 25
    if (rawAmount % 25 !== 0) {
      // Option 1 : Arrondir automatiquement et continuer
      const rounded = Math.round(rawAmount / 25) * 25
      setAmount(rounded.toString())
      setAmountError("")
      // On peut aussi demander confirmation à l'utilisateur, mais pour simplifier on arrondit
      // Pour l'instant on continue avec la valeur arrondie
      // (On pourrait aussi juste afficher l'erreur et ne pas soumettre)
      // Je choisis d'arrondir automatiquement pour fluidifier l'expérience
    }

    const finalAmount = Math.round(parseFloat(amount) / 25) * 25

    if (selectedParticipants.length === 0) {
      return
    }

    const sharePerPerson = finalAmount / selectedParticipants.length
    const splits = selectedParticipants.map(userId => ({
      userId,
      share: sharePerPerson,
    }))

    createExpense.mutate({
      description,
      amount: finalAmount,
      payerId,
      groupId,
      splits,
    })
  }

  const toggleParticipant = (userId: string) => {
    setSelectedParticipants(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  // Validation en temps réel pour afficher un warning (optionnel)
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setAmount(value)
    const num = parseFloat(value)
    if (!isNaN(num) && num > 0 && num % 25 !== 0) {
      setAmountError("Le montant sera arrondi au multiple de 25 FCFA le plus proche")
    } else {
      setAmountError("")
    }
  }

  return (
    <>
      <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center pointer-events-none">
        <div className="relative pointer-events-auto">
          {!open && (
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-full bg-primary/40 blur-xl"
            />
          )}
          <motion.button
            onClick={() => setOpen(true)}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.06 }}
            className="relative flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg"
          >
            <Plus className="w-6 h-6" strokeWidth={2.75} />
          </motion.button>
        </div>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl px-5 pb-8 pt-6 max-h-[70vh] overflow-y-auto max-w-md mx-auto"
        >
          <SheetHeader>
            <SheetTitle className="font-display text-2xl">Nouvelle dépense</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit} className="space-y-5 mt-6">
            <div>
              <Label htmlFor="desc">Description</Label>
              <Input
                id="desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Dîner"
                className="h-12"
                required
              />
            </div>
            <div>
              <Label htmlFor="amount">Montant (FCFA)</Label>
              <Input
                id="amount"
                type="number"
                step="25"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0"
                className="h-12"
                required
              />
              {amountError && (
                <p className="text-xs text-amber-600 mt-1">{amountError}</p>
              )}
            </div>
            <div>
              <Label>Payé par</Label>
              <Select value={payerId} onValueChange={setPayerId}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Sélectionner le payeur" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Participants</Label>
              <div className="space-y-2 mt-2 max-h-48 overflow-y-auto pr-1">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center space-x-3 py-1">
                    <Checkbox
                      id={`participant-${m.id}`}
                      checked={selectedParticipants.includes(m.id)}
                      onCheckedChange={() => toggleParticipant(m.id)}
                    />
                    <label htmlFor={`participant-${m.id}`} className="text-sm font-medium cursor-pointer">
                      {m.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={createExpense.isPending}
            >
              {createExpense.isPending ? "Ajout..." : "Ajouter la dépense"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}