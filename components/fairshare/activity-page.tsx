"use client"

import { useUser } from "@/contexts/user-context"
import { useQuery } from "@tanstack/react-query"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { Loader2, CreditCard, Users, TrendingUp, Receipt } from "lucide-react"
import { motion } from "framer-motion"

const COLORS = ["#00A550", "#E05260", "#0288D1", "#D97706", "#7C3AED"]

interface UserStats {
  totalSpent: number
  groupsCount: number
  expensesCount: number
  averagePerGroup: number
  recentGroups?: {
    id: string
    name: string
    totalSpent: number
    memberCount: number
  }[]
}

export function ActivityPage() {
  const { user } = useUser()

  const { data: stats, isLoading } = useQuery<UserStats>({
    queryKey: ["user-stats", user?.id],
    queryFn: () => fetch(`/api/users/${user!.id}/stats`).then(res => res.json()),
    enabled: !!user,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const pieData = stats?.recentGroups?.map(g => ({
    name: g.name,
    value: g.totalSpent,
  })) || []

  const hasGroups = pieData.length > 0

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 blur-3xl bg-primary/20" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 blur-3xl bg-primary/20" />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="font-display text-3xl font-bold text-foreground">Activité</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Aperçu de vos dépenses et statistiques concernant tous vos groupes.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <MetricCard
            icon={CreditCard}
            label="Total dépensé"
            value={stats?.totalSpent ?? 0}
            unit="FCFA"
            color="#00A550"
            delay={0.1}
          />
          <MetricCard
            icon={Users}
            label="Groupes"
            value={stats?.groupsCount ?? 0}
            color="#0288D1"
            delay={0.15}
          />
          <MetricCard
            icon={Receipt}
            label="Dépenses"
            value={stats?.expensesCount ?? 0}
            color="#D97706"
            delay={0.2}
          />
          <MetricCard
            icon={TrendingUp}
            label="Moyenne/groupe"
            value={stats?.averagePerGroup ?? 0}
            unit="FCFA"
            color="#7C3AED"
            delay={0.25}
          />
        </div>

        {hasGroups ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-border shadow-sm"
          >
            <h2 className="font-display font-semibold text-lg mb-2">Répartition par groupe</h2>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => `${Math.round(value).toLocaleString()} FCFA`}
                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
              {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-xs text-foreground/80 truncate max-w-[120px]">
                    {entry.name}
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {Math.round(entry.value).toLocaleString()} FCFA
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-border shadow-sm text-center"
          >
            <p className="text-muted-foreground">Aucun groupe avec dépenses pour le moment.</p>
            <p className="text-sm text-muted-foreground mt-1">
              Créez ou rejoignez un groupe pour voir vos statistiques.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

function MetricCard({
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
  const displayValue = unit ? Math.round(value).toLocaleString() : value
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
        {displayValue}{unit}
      </p>
    </motion.div>
  )
}