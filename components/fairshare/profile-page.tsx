"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { LogOut, Copy, Check, CreditCard, Users, TrendingUp, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useUser } from "@/contexts/user-context"
import { useQuery } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"

interface UserStats {
  totalSpent: number
  groupsCount: number
  expensesCount: number
  averagePerGroup: number
}

export function ProfilePage() {
  const { user, logout } = useUser()
  const [copied, setCopied] = useState(false)

  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: ["user-stats", user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/users/${user!.id}/stats`)
      if (!res.ok) throw new Error("Erreur chargement stats")
      return res.json()
    },
    enabled: !!user,
  })

  const copyPseudo = () => {
    if (user?.pseudo) {
      navigator.clipboard.writeText(user.pseudo)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Fond décoratif */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl bg-primary/20" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 blur-3xl bg-primary/20" />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6">
        {/* En-tête avec avatar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Avatar className="w-20 h-20 border-4 border-background shadow-xl">
            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white text-2xl font-bold">
              {user?.pseudo?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-foreground">
              {user?.pseudo}
            </h1>
            <button
              onClick={copyPseudo}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mt-1"
            >
              @{user?.pseudo?.toLowerCase()}
              {copied ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <StatCard
            icon={CreditCard}
            label="Total dépensé"
            value={stats?.totalSpent ?? 0}
            unit="€"
            color="#00A550"
            delay={0.1}
          />
          <StatCard
            icon={Users}
            label="Groupes"
            value={stats?.groupsCount ?? 0}
            color="#0288D1"
            delay={0.15}
          />
          <StatCard
            icon={Receipt}
            label="Dépenses"
            value={stats?.expensesCount ?? 0}
            color="#D97706"
            delay={0.2}
          />
          <StatCard
            icon={TrendingUp}
            label="Moyenne/groupe"
            value={stats?.averagePerGroup ?? 0}
            unit="€"
            color="#7C3AED"
            delay={0.25}
          />
        </div>

        {/* Déconnexion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            onClick={logout}
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Se déconnecter
          </Button>
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          FairShare v1.0.0 • Fait par NEWBIES
        </p>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  unit = "",
  color,
  delay = 0,
}: {
  icon: React.ElementType
  label: string
  value: number
  unit?: string
  color: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-border shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="p-2 rounded-full"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-2xl font-display font-bold text-foreground">
        {value.toFixed(unit ? 0 : 0)}{unit}
      </p>
    </motion.div>
  )
}