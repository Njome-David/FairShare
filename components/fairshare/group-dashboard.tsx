"use client"

import { BrandBar } from "@/components/fairshare/brand-bar"
import { GroupHeader } from "@/components/fairshare/group-header"
import { BalanceHero } from "@/components/fairshare/balance-hero"
import { SettlementList } from "@/components/fairshare/settlement-list"
import { RecentExpenses } from "@/components/fairshare/recent-expenses"
import { AddExpenseFab } from "@/components/fairshare/add-expense-fab"
import { BottomNav } from "@/components/fairshare/bottom-nav"

interface Group {
  id: string
  name: string
  emoji: string
  memberCount: number
  lastActivity: string
  inviteCode: string
}

interface GroupDashboardProps {
  group: Group
  pseudo: string
  onBack: () => void
}

// Sample data
const members = [
  { id: "1", name: "Toi", initial: "T", color: "#00A550" },
  { id: "2", name: "Marie", initial: "M", color: "#E05260" },
  { id: "3", name: "Alex", initial: "A", color: "#0288D1" },
  { id: "4", name: "Lea", initial: "L", color: "#D97706" },
  { id: "5", name: "Sam", initial: "S", color: "#7C3AED" },
]

const settlements = [
  {
    id: "s1",
    from: members[2],
    to: members[0],
    amount: 48.5,
    emoji: "✈️",
  },
  {
    id: "s2",
    from: members[3],
    to: members[0],
    amount: 32.0,
    emoji: "🏠",
  },
  {
    id: "s3",
    from: members[0],
    to: members[1],
    amount: 18.25,
    emoji: "🍕",
  },
]

const recentExpenses = [
  {
    id: "e1",
    title: "Airbnb Alfama",
    emoji: "🏠",
    amount: 320.0,
    paidBy: members[0],
    splitCount: 5,
    date: "Hier",
    yourShare: 64.0,
    youArePayer: true,
  },
  {
    id: "e2",
    title: "Diner Time Out Market",
    emoji: "🍽️",
    amount: 127.4,
    paidBy: members[1],
    splitCount: 5,
    date: "Hier",
    yourShare: 25.48,
    youArePayer: false,
  },
  {
    id: "e3",
    title: "Billets Tramway 28",
    emoji: "🚋",
    amount: 15.0,
    paidBy: members[2],
    splitCount: 5,
    date: "Il y a 2 jours",
    yourShare: 3.0,
    youArePayer: false,
  },
  {
    id: "e4",
    title: "Pasteis de Belem",
    emoji: "🥐",
    amount: 22.5,
    paidBy: members[0],
    splitCount: 5,
    date: "Il y a 2 jours",
    yourShare: 4.5,
    youArePayer: true,
  },
]

export function GroupDashboard({ group, pseudo, onBack }: GroupDashboardProps) {
  const totalOwedToYou = 80.5
  const totalYouOwe = 18.25
  const netBalance = totalOwedToYou - totalYouOwe

  // Update the first member name to pseudo
  const updatedMembers = members.map((m, i) =>
    i === 0 ? { ...m, name: pseudo, initial: pseudo[0].toUpperCase() } : m
  )

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <div className="relative mx-auto max-w-md min-h-screen">
        {/* Ambient gradient */}
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
            emoji={group.emoji}
            inviteCode={group.inviteCode}
            members={updatedMembers}
          />

          <BalanceHero
            netBalance={netBalance}
            totalOwedToYou={totalOwedToYou}
            totalYouOwe={totalYouOwe}
          />

          <SettlementList
            settlements={settlements.map((s) => ({
              ...s,
              from: s.from.id === "1" ? { ...s.from, name: pseudo, initial: pseudo[0].toUpperCase() } : s.from,
              to: s.to.id === "1" ? { ...s.to, name: pseudo, initial: pseudo[0].toUpperCase() } : s.to,
            }))}
            originalTransactionCount={12}
          />

          <RecentExpenses
            expenses={recentExpenses.map((e) => ({
              ...e,
              paidBy: e.paidBy.id === "1" ? { ...e.paidBy, name: pseudo, initial: pseudo[0].toUpperCase() } : e.paidBy,
            }))}
          />
        </div>

        <AddExpenseFab />
        <BottomNav />
      </div>
    </main>
  )
}
