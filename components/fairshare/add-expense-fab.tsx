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
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount <= 0) return
    if (selectedParticipants.length === 0) return

    const sharePerPerson = numAmount / selectedParticipants.length
    const splits = selectedParticipants.map(userId => ({
      userId,
      share: sharePerPerson,
    }))

    createExpense.mutate({
      description,
      amount: numAmount,
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

  return (
    <>
      {/* FAB */}
      <div className="fixed bottom-20 left-0 right-0 z-40 flex justify-center pointer-events-none">
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
        <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
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
                required
              />
            </div>
            <div>
              <Label htmlFor="amount">Montant (€)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label>Payé par</Label>
              <Select value={payerId} onValueChange={setPayerId}>
                <SelectTrigger>
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
              <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`participant-${m.id}`}
                      checked={selectedParticipants.includes(m.id)}
                      onCheckedChange={() => toggleParticipant(m.id)}
                    />
                    <label htmlFor={`participant-${m.id}`} className="text-sm">
                      {m.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={createExpense.isPending}>
              {createExpense.isPending ? "Ajout..." : "Ajouter la dépense"}
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}