// app/page.tsx (version finale avec navigation par onglets)
"use client"

import { useState } from "react"
import { useUser } from "@/contexts/user-context"
import { WelcomeScreen } from "@/components/fairshare/welcome-screen"
import { GroupsList } from "@/components/fairshare/groups-list"
import { GroupDashboard } from "@/components/fairshare/group-dashboard"
import { ActivityPage } from "@/components/fairshare/activity-page"
import { BottomNav } from "@/components/fairshare/bottom-nav"
import { Loader2 } from "lucide-react"

export default function App() {
  const { user, isLoading } = useUser()
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"home" | "groups" | "activity" | "profile">("groups")

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <WelcomeScreen />
  }

  // Si un groupe est sélectionné, on affiche son dashboard, peu importe l'onglet
  if (selectedGroupId) {
    return (
      <GroupDashboard
        groupId={selectedGroupId}
        onBack={() => setSelectedGroupId(null)}
      />
    )
  }

  // Sinon, on affiche l'écran correspondant à l'onglet actif
  return (
    <div className="min-h-screen bg-background">
      {activeTab === "groups" && (
        <GroupsList onSelectGroup={setSelectedGroupId} />
      )}
      {activeTab === "activity" && <ActivityPage />}
      {activeTab === "home" && (
        // L'onglet Accueil peut simplement rediriger vers GroupsList ou afficher un dashboard récapitulatif
        <GroupsList onSelectGroup={setSelectedGroupId} />
      )}
      {activeTab === "profile" && (
        <div className="p-5">
          <h1 className="font-display text-2xl font-bold mb-4">Profil</h1>
          <p>Pseudo : {user.pseudo}</p>
          <button
            onClick={() => {
              localStorage.removeItem("fairshare_user")
              window.location.reload()
            }}
            className="mt-4 text-destructive"
          >
            Se déconnecter
          </button>
        </div>
      )}
      <BottomNav active={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}