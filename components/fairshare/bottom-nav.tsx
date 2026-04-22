// components/fairshare/bottom-nav.tsx
"use client"

import { motion } from "framer-motion"
import { Home, Activity, User } from "lucide-react"

const tabs = [
  { id: "home", icon: Home, label: "Accueil" },
  { id: "activity", icon: Activity, label: "Activité" },
  { id: "profile", icon: User, label: "Profil" },
] as const

interface BottomNavProps {
  active: typeof tabs[number]["id"]
  onTabChange: (id: typeof tabs[number]["id"]) => void
}

export function BottomNav({ active, onTabChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 mx-auto max-w-md"
      aria-label="Navigation principale"
    >
      <div
        className="absolute inset-x-0 bottom-full h-8 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(242, 244, 242, 0.95), transparent)",
        }}
      />

      <div className="relative mx-4 mb-3 h-16 rounded-full border border-border bg-white/90 backdrop-blur-xl shadow-[0_-2px_24px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-3 h-full items-center">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              isActive={active === tab.id}
              onClick={() => onTabChange(tab.id)}
            />
          ))}
        </div>
      </div>
    </nav>
  )
}

function TabButton({
  tab,
  isActive,
  onClick,
}: {
  tab: { id: string; icon: typeof Home; label: string }
  isActive: boolean
  onClick: () => void
}) {
  const Icon = tab.icon
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col items-center justify-center h-full gap-0.5 group"
      aria-label={tab.label}
      aria-current={isActive ? "page" : undefined}
    >
      {isActive && (
        <motion.div
          layoutId="nav-active-dot"
          className="absolute -top-0.5 w-1 h-1 rounded-full bg-primary"
          style={{ boxShadow: "0 0 6px rgba(0, 165, 80, 0.7)" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      <Icon
        className={`w-[18px] h-[18px] transition-colors ${
          isActive ? "text-primary" : "text-muted-foreground group-active:text-foreground"
        }`}
        strokeWidth={isActive ? 2.5 : 2}
      />
      <span
        className={`text-[10px] font-medium transition-colors ${
          isActive ? "text-primary" : "text-muted-foreground"
        }`}
      >
        {tab.label}
      </span>
    </button>
  )
}