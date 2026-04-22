// components/fairshare/group-dashboard.tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { BrandBar } from "./brand-bar"
import { GroupHeader } from "./group-header"
import { BalanceHero } from "./balance-hero"
import { SettlementList } from "./settlement-list"
import { RecentExpenses } from "./recent-expenses"
import { AddExpenseFab } from "./add-expense-fab"
import { BottomNav } from "./bottom-nav"
import { useUser } from "@/contexts/user-context"

interface GroupDashboardProps {
  groupId: string
  onBack: () => void
}

export function GroupDashboard({ groupId, onBack }: GroupDashboardProps) {
  const { user } = useUser()

  // Récupérer les détails du groupe
  const { data: group, isLoading: groupLoading } = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => fetch(`/api/groups/${groupId}`).then(res => res.json()),
  })

  // Récupérer les balances
  const { data: balances, isLoading: balancesLoading } = useQuery({
    queryKey: ["balances", groupId],
    queryFn: () => fetch(`/api/groups/${groupId}/balances`).then(res => res.json()),
  })

  if (groupLoading || balancesLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Préparer les données pour les composants enfants
  const members = group.members.map((m: any) => ({
    id: m.userId,
    name: m.user.pseudo,
    initial: m.user.pseudo[0].toUpperCase(),
    color: `hsl(${Math.abs(m.userId.split('').reduce((acc: number, c: string) => acc + c.charCodeAt(0), 0)) % 360}, 70%, 50%)`, // couleur stable basée sur l'ID
  }))

  // Calculer le solde net de l'utilisateur courant
  const currentUserBalance = balances.netBalances.find((b: any) => b.userId === user?.id)
  const netBalance = currentUserBalance?.amount || 0
  const totalOwedToYou = balances.netBalances
    .filter((b: any) => b.amount > 0)
    .reduce((sum: number, b: any) => sum + b.amount, 0)
  const totalYouOwe = balances.netBalances
    .filter((b: any) => b.amount < 0)
    .reduce((sum: number, b: any) => sum + Math.abs(b.amount), 0)

  // Formater les transactions suggérées pour SettlementList
  const settlements = balances.suggestedTransactions.map((t: any) => {
    const fromMember = members.find((m: any) => m.id === t.from)
    const toMember = members.find((m: any) => m.id === t.to)
    return {
      id: `${t.from}-${t.to}`,
      from: fromMember,
      to: toMember,
      amount: t.amount,
      emoji: "💸",
    }
  })

  // Formater les dépenses récentes
  const recentExpenses = group.expenses.map((e: any) => {
    const payer = members.find((m: any) => m.id === e.payerId)
    const yourShare = e.splits.find((s: any) => s.userId === user?.id)?.share || 0
    return {
      id: e.id,
      title: e.description,
      emoji: "💰", // à améliorer
      amount: e.amount,
      paidBy: payer,
      splitCount: e.splits.length,
      date: new Date(e.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
      yourShare,
      youArePayer: e.payerId === user?.id,
    }
  })

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="relative mx-auto max-w-md min-h-screen">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 90% 55% at 50% 0%, rgba(0, 165, 80, 0.12), transparent 70%)",
          }}
        />

        <div className="relative">
          <BrandBar onBack={onBack} />

          <GroupHeader
            groupName={group.name}
            inviteCode={group.inviteCode}
            members={members}
            totalSpent={group.totalSpent}
          />

          <BalanceHero
            netBalance={netBalance}
            totalOwedToYou={totalOwedToYou}
            totalYouOwe={totalYouOwe}
          />

          <SettlementList
            settlements={settlements}
            originalTransactionCount={group.expenses.length * 2} // approximatif
          />

          <RecentExpenses
            expenses={recentExpenses}
            groupId={groupId}
          />
        </div>

        <AddExpenseFab groupId={groupId} members={members} />
        <BottomNav />
      </div>
    </main>
  )
}