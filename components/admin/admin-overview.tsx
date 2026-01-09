"use client"

import { motion } from "framer-motion"
import { Users, Video, FileText, TrendingUp } from "lucide-react"

interface OverviewStats {
  totalUsers: number
  totalVideos: number
  totalVotes: number
  activeUsers: number
}

interface AdminOverviewProps {
  stats: OverviewStats
}

export default function AdminOverview({ stats }: AdminOverviewProps) {
  const statCards = [
    {
      icon: Users,
      label: "Total Users",
      value: stats.totalUsers,
      color: "from-blue-500/20 to-blue-500/5",
      iconColor: "text-blue-400",
    },
    {
      icon: Video,
      label: "Total Videos",
      value: stats.totalVideos,
      color: "from-purple-500/20 to-purple-500/5",
      iconColor: "text-purple-400",
    },
    {
      icon: FileText,
      label: "Total Votes",
      value: stats.totalVotes,
      color: "from-pink-500/20 to-pink-500/5",
      iconColor: "text-pink-400",
    },
    {
      icon: TrendingUp,
      label: "Active Users",
      value: stats.activeUsers,
      color: "from-green-500/20 to-green-500/5",
      iconColor: "text-green-400",
    },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
        <p className="text-muted-foreground">Monitor your platform activity</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-gradient-to-br ${stat.color} border border-primary/20 rounded-xl p-6 backdrop-blur-sm`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-4xl font-bold text-white">{stat.value.toLocaleString()}</p>
                </div>
                <div className={`p-3 rounded-lg bg-black/50 ${stat.iconColor}`}>
                  <Icon size={24} />
                </div>
              </div>
              <div className="h-1 bg-black/30 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-primary/50"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, delay: index * 0.1 }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Activity Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-card border border-primary/20 rounded-xl p-6"
      >
        <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            "New user registration: 5 users joined",
            "Video uploads: 3 new videos pending review",
            "Voting activity: 1,250 votes cast today",
            "Platform engagement: 84% user retention",
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 bg-black/50 rounded-lg"
            >
              <div className="w-2 h-2 rounded-full bg-primary" />
              <p className="text-sm text-white">{activity}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
