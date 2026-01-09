"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useSessionUser } from "@/hooks/use-session-user"
import { useMediaQuery } from "@/hooks/use-mobile"

export default function WelcomeGreeting() {
  const [greeting, setGreeting] = useState("")
  const [date, setDate] = useState("")
  const [mounted, setMounted] = useState(false)
  const { user } = useSessionUser()
  const isMobile = useMediaQuery("(max-width: 768px)")

  useEffect(() => {
    setMounted(true)
    const hour = new Date().getHours()
    if (hour < 12) setGreeting("Good Morning")
    else if (hour < 18) setGreeting("Good Afternoon")
    else setGreeting("Good Evening")

    const today = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
    setDate(today)
  }, [])

  if (!mounted) return null

  const displayName = user?.name ? user.name.split(" ")[0] : "USER"

  return (
    <motion.div
      className="relative mb-8 md:mb-12 bg-gradient-to-r from-primary/15 via-primary/10 to-transparent rounded-xl md:rounded-2xl p-6 md:p-8 border border-primary/20 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-start gap-4 md:gap-6">
        {/* Profile Picture */}
        <motion.div
          className="flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary/30 border-2 border-primary/50 overflow-hidden flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        >
          {user?.pic ? (
            <Image
              src={user.pic}
              alt={user.name || "Profile"}
              width={64}
              height={64}
              unoptimized
              className="object-cover w-full h-full"
            />
          ) : (
            <span className="text-2xl md:text-3xl">👤</span>
          )}
        </motion.div>

        <div className="space-y-3 md:space-y-4 flex-1">
        <motion.p
          className="text-primary text-base md:text-lg font-semibold flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <span className="text-xl md:text-2xl">👋</span>
          {greeting}
        </motion.p>

        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
            Welcome back, <span className="text-primary">{displayName}</span>!
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-medium">Ready to make an impact today?</p>
        </motion.div>

        <motion.div
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 pt-2 md:pt-4 border-t border-primary/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs md:text-sm text-muted-foreground">📅 {date}</p>
          <p className="text-xs md:text-sm text-primary/80 font-medium">Vote • Quiz • Stream • Empower</p>
        </motion.div>
        </div>
      </div>

      {user?.isSubscribed && (
        <motion.div
          className="absolute top-4 md:top-6 right-4 md:right-6 bg-primary/20 border border-primary/30 rounded-full px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm text-primary font-semibold whitespace-nowrap"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        >
          ⭐ Premium
        </motion.div>
      )}

      <motion.div
        className="absolute -top-2 md:-top-4 right-6 md:right-10 text-primary text-2xl md:text-4xl"
        animate={{ y: [0, -10, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
      >
        ✨
      </motion.div>
    </motion.div>
  )
}
