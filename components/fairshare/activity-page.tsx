"use client"

import { useUser } from "@/contexts/user-context"
import { useQuery } from "@tanstack/react-query"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Loader2 } from "lucide-react"

const COLORS = ["#00A550", "#E05260", "#0288D1", "#D97706", "#7C3AED"]

export function ActivityPage() {
  const { user } = useUser()

  // Récupérer tous les groupes de l'utilisateur
  const { data: groups, isLoading } = useQuery({
    queryKey: ["groups", user?.id],
    queryFn: () => fetch(`/api/users/${user!.id}/groups`).then(res => res.json()),
    enabled: !!user,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // Données pour le graphique en barres (dépenses par groupe)
  const barData = groups.map((g: any) => ({
    name: g.name,
    total: g.totalSpent,
  }))

  // Données pour le camembert (répartition globale)
  const pieData = groups.map((g: any) => ({
    name: g.name,
    value: g.totalSpent,
  }))

  const totalGlobal = groups.reduce((sum: number, g: any) => sum + g.totalSpent, 0)

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-5 py-8">
        <h1 className="font-display text-3xl font-bold mb-6">Activité</h1>

        <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border">
          <h2 className="font-semibold text-lg mb-4">Dépenses par groupe</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#00A550" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border">
          <h2 className="font-semibold text-lg mb-4">Répartition globale</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center mt-4 text-sm text-muted-foreground">
            Total dépensé : {totalGlobal.toFixed(2)}€
          </p>
        </div>
      </div>
    </div>
  )
}