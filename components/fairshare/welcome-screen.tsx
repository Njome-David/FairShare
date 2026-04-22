// components/fairshare/welcome-screen.tsx
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUser } from "@/contexts/user-context"
import Image from "next/image"

export function WelcomeScreen() {
  const { login } = useUser()
  const [pseudo, setPseudo] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = pseudo.trim()
    if (trimmed.length < 2) {
      setError("Minimum 2 caractères")
      return
    }
    if (trimmed.length > 20) {
      setError("Maximum 20 caractères")
      return
    }
    setIsLoading(true)
    try {
      await login(trimmed)
    } catch (err) {
      setError("Erreur de connexion, réessayez")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div
        className="pointer-events-none fixed inset-0 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(0, 165, 80, 0.08), transparent 60%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-sm flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-8"
        >
          <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-lg shadow-primary/10">
            <Image
              src="/fairshare-logo.svg"
              alt="FairShare"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-center mb-10"
        >
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground mb-2">
            Bienvenue sur FairShare
          </h1>
          <p className="text-foreground/70 text-sm">
            Partagez vos dépenses entre amis, sans friction.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          onSubmit={handleSubmit}
          className="w-full space-y-4"
        >
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Votre pseudo"
              value={pseudo}
              onChange={(e) => {
                setPseudo(e.target.value)
                setError("")
              }}
              className="h-14 text-center text-lg font-medium bg-white border-black/10 rounded-2xl placeholder:text-foreground/40 focus-visible:ring-primary/30 focus-visible:ring-offset-0"
              autoFocus
              autoComplete="off"
              autoCapitalize="words"
              disabled={isLoading}
            />
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-destructive text-center"
              >
                {error}
              </motion.p>
            )}
          </div>

          <Button
            type="submit"
            disabled={pseudo.trim().length < 2 || isLoading}
            className="w-full h-14 text-base font-semibold rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 disabled:opacity-40 disabled:shadow-none transition-all"
          >
            {isLoading ? "Connexion..." : "Entrer"}
            {!isLoading && <ArrowRight className="w-5 h-5 ml-2" />}
          </Button>
        </motion.form>
        {/* Footer supprimé */}
      </motion.div>
    </div>
  )
}