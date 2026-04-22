"use client"

import { useState } from "react"
import { useUser } from "@/contexts/user-context"
import { WelcomeScreen } from "@/components/fairshare/welcome-screen"
import { GroupsList } from "@/components/fairshare/groups-list"
import { GroupDashboard } from "@/components/fairshare/group-dashboard"
import { ActivityPage } from "@/components/fairshare/activity-page"
import { BottomNav } from "@/components/fairshare/bottom-nav"
import { Loader2 } from "lucide-react"
import { ProfilePage } from "@/components/fairshare/profile-page"

export default function App() {
  const { user, isLoading } = useUser()
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"home" | "activity" | "profile">("home")

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

  if (selectedGroupId) {
    return (
      <GroupDashboard
        groupId={selectedGroupId}
        onBack={() => setSelectedGroupId(null)}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {activeTab === "home" && <GroupsList onSelectGroup={setSelectedGroupId} />}
      {activeTab === "activity" && <ActivityPage />}
      {activeTab === "profile" && <ProfilePage />}
      <BottomNav active={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}