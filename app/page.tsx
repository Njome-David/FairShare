"use client";

import { useState } from "react";
import { useUser } from "@/contexts/user-context";
import { WelcomeScreen } from "@/components/fairshare/welcome-screen";
import { GroupsList } from "@/components/fairshare/groups-list";
import { GroupDashboard } from "@/components/fairshare/group-dashboard";
import { Loader2 } from "lucide-react";

export default function App() {
  const { user, isLoading } = useUser();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

  // État de chargement initial (lecture localStorage)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F2F4F2] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Écran 1 : Accueil (aucun utilisateur connecté)
  if (!user) {
    return <WelcomeScreen />;
  }

  // Écran 3 : Dashboard du groupe (groupe sélectionné)
  if (selectedGroupId) {
    return (
      <GroupDashboard
        groupId={selectedGroupId}
        onBack={() => setSelectedGroupId(null)}
      />
    );
  }

  // Écran 2 : Liste des groupes
  return <GroupsList onSelectGroup={setSelectedGroupId} />;
}