"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Users, ChevronRight, LogOut, UserPlus, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface Group {
  id: string
  name: string
  emoji: string
  memberCount: number
  lastActivity: string
}

interface GroupsListProps {
  pseudo: string
  groups: Group[]
  onSelectGroup: (groupId: string) => void
  onCreateGroup: (name: string, emoji: string) => void
  onJoinGroup: (code: string) => void
  onLogout: () => void
}

export function GroupsList({
  pseudo,
  groups,
  onSelectGroup,
  onCreateGroup,
  onJoinGroup,
  onLogout,
}: GroupsListProps) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showJoinModal, setShowJoinModal] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [newGroupEmoji, setNewGroupEmoji] = useState("🎉")
  const [joinCode, setJoinCode] = useState("")

  const emojis = ["🎉", "✈️", "🏠", "🍕", "🎂", "🏖️", "🎿", "🎮", "🍻", "🎵"]

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault()
    if (newGroupName.trim().length >= 2) {
      onCreateGroup(newGroupName.trim(), newGroupEmoji)
      setNewGroupName("")
      setShowCreateModal(false)
    }
  }

  const handleJoinGroup = (e: React.FormEvent) => {
    e.preventDefault()
    if (joinCode.trim().length >= 4) {
      onJoinGroup(joinCode.trim().toUpperCase())
      setJoinCode("")
      setShowJoinModal(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient gradient */}
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 90% 55% at 50% 0%, rgba(0, 165, 80, 0.1), transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-md min-h-screen pb-6">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-black/5">
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <Image
                  src="/fairshare-logo.svg"
                  alt="FairShare"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="text-xs text-foreground/60 font-medium">Bonjour,</p>
                <p className="font-display font-bold text-lg text-foreground leading-tight">
                  {pseudo}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center text-foreground/60 hover:text-foreground hover:bg-black/10 transition-colors"
              aria-label="Se deconnecter"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>

        {/* Section title */}
        <div className="px-5 pt-6 pb-4">
          <h1 className="font-display text-2xl font-bold text-foreground">Mes Groupes</h1>
        </div>

        {/* Groups list */}
        <div className="px-5 space-y-3">
          {groups.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-black/5 p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-1">
                Aucun groupe
              </h3>
              <p className="text-sm text-foreground/60">
                Creez un groupe ou rejoignez-en un pour commencer
              </p>
            </motion.div>
          ) : (
            groups.map((group, index) => (
              <motion.button
                key={group.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSelectGroup(group.id)}
                className="w-full bg-white rounded-2xl border border-black/5 p-4 flex items-center gap-4 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 transition-all text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
                  {group.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-semibold text-foreground truncate">
                    {group.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-foreground/60 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {group.memberCount} membre{group.memberCount > 1 ? "s" : ""}
                    </span>
                    <span className="text-foreground/30">·</span>
                    <span className="text-xs text-foreground/50">{group.lastActivity}</span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-foreground/30 group-hover:text-primary transition-colors shrink-0" />
              </motion.button>
            ))
          )}
        </div>

        {/* Action buttons */}
        <div className="px-5 pt-6 space-y-3">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="w-full h-14 text-base font-semibold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/15"
          >
            <Plus className="w-5 h-5 mr-2" />
            Creer un groupe
          </Button>
          <Button
            onClick={() => setShowJoinModal(true)}
            variant="outline"
            className="w-full h-14 text-base font-semibold rounded-2xl border-black/10 bg-white hover:bg-black/5 text-foreground"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Rejoindre un groupe
          </Button>
        </div>
      </div>

      {/* Create Group Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCreateModal(false)}
              className="fixed inset-0 bg-black/40 z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl p-6 pb-10 max-w-md mx-auto"
            >
              <div className="w-10 h-1 bg-black/10 rounded-full mx-auto mb-6" />
              <h2 className="font-display text-xl font-bold text-foreground mb-6">
                Nouveau groupe
              </h2>
              <form onSubmit={handleCreateGroup} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">
                    Choisir un emoji
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setNewGroupEmoji(emoji)}
                        className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                          newGroupEmoji === emoji
                            ? "bg-primary/15 ring-2 ring-primary"
                            : "bg-black/5 hover:bg-black/10"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">
                    Nom du groupe
                  </label>
                  <Input
                    type="text"
                    placeholder="Ex: Weekend Lisbonne"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    className="h-14 text-base bg-white border-black/10 rounded-xl"
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  disabled={newGroupName.trim().length < 2}
                  className="w-full h-14 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Creer le groupe
                </Button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Join Group Modal */}
      <AnimatePresence>
        {showJoinModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowJoinModal(false)}
              className="fixed inset-0 bg-black/40 z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-background rounded-t-3xl p-6 pb-10 max-w-md mx-auto"
            >
              <div className="w-10 h-1 bg-black/10 rounded-full mx-auto mb-6" />
              <h2 className="font-display text-xl font-bold text-foreground mb-6">
                Rejoindre un groupe
              </h2>
              <form onSubmit={handleJoinGroup} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground/70">
                    Code d&apos;invitation
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                    <Input
                      type="text"
                      placeholder="XX-XXXX"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      className="h-14 text-base text-center font-mono tracking-widest bg-white border-black/10 rounded-xl pl-10"
                      autoFocus
                      maxLength={7}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={joinCode.trim().length < 4}
                  className="w-full h-14 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Rejoindre
                </Button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
