"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { User, Award, TrendingUp, Mail, Calendar } from "lucide-react"
import Image from "next/image"
import { useSessionUser } from "@/hooks/use-session-user"

export default function ProfilePage() {
  const { user } = useSessionUser()
  const [stats] = useState({
    videosWatched: 24,
    quizzesTaken: 8,
    totalPoints: 450,
    streak: 12,
  })

  useEffect(() => {
    console.log("ProfilePage - Current user:", user)
    console.log("ProfilePage - dateOfBirth:", user?.dateOfBirth)
    console.log("ProfilePage - pic:", user?.pic ? "Available" : "Not available")
  }, [user])

  const formatDate = (dateString?: string) => {
    console.log("formatDate called with:", dateString)
    if (!dateString) return "Not set"
    try {
      const date = new Date(dateString)
      const formatted = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      console.log("formatDate result:", formatted)
      return formatted
    } catch (error) {
      console.error("formatDate error:", error)
      return dateString
    }
  }

  const getJoinDate = () => {
    // Use the created_at timestamp from the database
    if (user?.created_at) {
      return formatDate(user.created_at)
    }
    return "Not available"
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-gold to-primary rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
            {user?.pic ? (
              <Image
                src={user.pic}
                alt={user.name || "Profile"}
                width={80}
                height={80}
                unoptimized
                className="object-cover w-full h-full"
              />
            ) : (
              <User size={40} className="text-black" />
            )}
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gold">{user?.name || "User"}</h1>
            <p className="text-muted-foreground">Member Since {getJoinDate()}</p>
          </div>
        </div>

        {/* User Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <motion.div
            className="bg-card border border-primary/30 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Mail size={20} className="text-primary" />
              <h3 className="text-sm text-muted-foreground">Email Address</h3>
            </div>
            <p className="text-lg font-semibold text-white">{user?.email || "Not set"}</p>
          </motion.div>

          <motion.div
            className="bg-card border border-primary/30 rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <Calendar size={20} className="text-primary" />
              <h3 className="text-sm text-muted-foreground">Date of Birth</h3>
            </div>
            <p className="text-lg font-semibold text-white">{formatDate(user?.dateOfBirth)}</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { icon: TrendingUp, label: "Videos Watched", value: stats.videosWatched },
          { icon: Award, label: "Quizzes Taken", value: stats.quizzesTaken },
          { icon: User, label: "Total Points", value: stats.totalPoints },
          { icon: TrendingUp, label: "Current Streak", value: `${stats.streak} days` },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            className="bg-card border border-primary/30 rounded-xl p-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <stat.icon className="text-gold mx-auto mb-3" size={32} />
            <p className="text-muted-foreground text-sm mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Profile Settings */}
      <motion.div
        className="bg-card border border-primary/30 rounded-xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-2xl font-bold text-gold mb-6">Account Settings</h2>
        <div className="space-y-6">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Email Address</label>
            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full bg-background text-white p-3 rounded-lg border border-primary/30"
            />
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Date of Birth</label>
            <input
              type="date"
              value={user?.dateOfBirth || ""}
              readOnly
              className="w-full bg-background text-white p-3 rounded-lg border border-primary/30"
            />
          </div>
          <motion.button
            className="!bg-primary/50 w-full py-3 rounded-lg font-bold hover:bg-gold/90 transition  text-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Update Profile
          </motion.button>
        </div>
      </motion.div>
    </div>
  )
}
