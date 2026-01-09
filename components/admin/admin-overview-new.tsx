"use client"

import { motion } from "framer-motion"
import { 
  Users, 
  Video, 
  TrendingUp, 
  Activity, 
  Zap, 
  BarChart3, 
  Clock,
  Heart,
  MessageSquare,
  Award,
  Flame
} from "lucide-react"

interface OverviewStats {
  totalUsers: number
  totalVideos: number
  totalVotes: number
  activeUsers: number
  totalQuizzes: number
  avgEngagementRate: number
  newUsersThisWeek: number
  videosThisWeek: number
}

interface AdminOverviewProps {
  stats: OverviewStats
}

interface StatCard {
  icon: any
  label: string
  value: number | string
  subtext?: string
  color: string
  bgColor: string
  trend?: number
}

export default function AdminOverviewNew({ stats }: AdminOverviewProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const primaryStats: StatCard[] = [
    {
      icon: Users,
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      subtext: `+${stats.newUsersThisWeek} this week`,
      color: "text-blue-400",
      bgColor: "from-blue-500/20 to-blue-500/5",
      trend: stats.newUsersThisWeek,
    },
    {
      icon: Video,
      label: "Total Videos",
      value: stats.totalVideos.toLocaleString(),
      subtext: `+${stats.videosThisWeek} this week`,
      color: "text-purple-400",
      bgColor: "from-purple-500/20 to-purple-500/5",
      trend: stats.videosThisWeek,
    },
    {
      icon: Flame,
      label: "Total Votes",
      value: stats.totalVotes.toLocaleString(),
      subtext: `${stats.avgEngagementRate} per video`,
      color: "text-red-400",
      bgColor: "from-red-500/20 to-red-500/5",
    },
    {
      icon: Activity,
      label: "Active Users",
      value: stats.activeUsers.toLocaleString(),
      subtext: `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% engagement`,
      color: "text-green-400",
      bgColor: "from-green-500/20 to-green-500/5",
    },
  ]

  const secondaryStats: StatCard[] = [
    {
      icon: BarChart3,
      label: "Avg Engagement",
      value: `${stats.avgEngagementRate}`,
      subtext: "votes per video",
      color: "text-yellow-400",
      bgColor: "from-yellow-500/20 to-yellow-500/5",
    },
    {
      icon: Clock,
      label: "New This Week",
      value: `${stats.newUsersThisWeek}`,
      subtext: "new users registered",
      color: "text-cyan-400",
      bgColor: "from-cyan-500/20 to-cyan-500/5",
    },
    {
      icon: Zap,
      label: "Videos This Week",
      value: `${stats.videosThisWeek}`,
      subtext: "new uploads",
      color: "text-orange-400",
      bgColor: "from-orange-500/20 to-orange-500/5",
    },
    {
      icon: Award,
      label: "Platform Health",
      value: "98%",
      subtext: "system uptime",
      color: "text-pink-400",
      bgColor: "from-pink-500/20 to-pink-500/5",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
          <BarChart3 className="text-primary" size={32} />
          Dashboard Overview
        </h2>
        <p className="text-muted-foreground text-lg">Monitor and manage your VOTY platform</p>
      </motion.div>

      {/* Primary Stats Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {primaryStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`group bg-gradient-to-br ${stat.bgColor} border border-primary/20 rounded-xl p-6 backdrop-blur-sm cursor-pointer overflow-hidden relative`}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:via-primary/5 group-hover:to-primary/0 transition-all duration-300" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <div>
                      <p className="text-4xl font-bold text-white">{stat.value}</p>
                      {stat.subtext && (
                        <p className="text-xs text-primary/80 mt-1">{stat.subtext}</p>
                      )}
                    </div>
                  </div>
                  <motion.div
                    className={`p-3 rounded-lg bg-black/50 ${stat.color} group-hover:bg-black/70 transition-colors`}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon size={24} />
                  </motion.div>
                </div>

                {/* Trend indicator */}
                {stat.trend !== undefined && stat.trend > 0 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, delay: index * 0.2 }}
                    className="h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent rounded-full"
                  />
                )}
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Secondary Stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {secondaryStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`group bg-gradient-to-br ${stat.bgColor} border border-primary/20 rounded-xl p-5 backdrop-blur-sm cursor-pointer overflow-hidden relative`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:via-primary/5 group-hover:to-primary/0 transition-all duration-300" />

              <div className="relative z-10 flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  {stat.subtext && (
                    <p className="text-xs text-primary/70">{stat.subtext}</p>
                  )}
                </div>
                <motion.div
                  className={`p-2.5 rounded-lg bg-black/50 ${stat.color} group-hover:bg-black/70 transition-colors`}
                  whileHover={{ rotate: 10, scale: 1.05 }}
                >
                  <Icon size={20} />
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2 bg-card border border-primary/20 rounded-xl p-6 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="text-primary" size={24} />
            Platform Activity
          </h3>
          <div className="space-y-3">
            {[
              { icon: Users, label: `${stats.newUsersThisWeek} new users registered this week`, color: "text-blue-400" },
              { icon: Video, label: `${stats.videosThisWeek} videos uploaded this week`, color: "text-purple-400" },
              { icon: Flame, label: `${stats.totalVotes.toLocaleString()} total votes received`, color: "text-red-400" },
              { icon: TrendingUp, label: `${stats.activeUsers} users active in the last 30 days`, color: "text-green-400" },
            ].map((activity, index) => {
              const Icon = activity.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3 p-4 bg-black/50 rounded-lg hover:bg-black/70 transition-colors cursor-pointer"
                >
                  <div className={`p-2 rounded-lg bg-primary/10 ${activity.color}`}>
                    <Icon size={20} />
                  </div>
                  <p className="text-sm text-white flex-1">{activity.label}</p>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                    className="w-2 h-2 rounded-full bg-primary"
                  />
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 rounded-xl p-6 backdrop-blur-sm"
        >
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Award className="text-primary" size={24} />
            Key Metrics
          </h3>
          <div className="space-y-4">
            {[
              { 
                label: "Total Users", 
                value: stats.totalUsers,
                percentage: 100,
              },
              { 
                label: "Video Content", 
                value: stats.totalVideos,
                percentage: Math.min((stats.totalVideos / 100) * 100, 100),
              },
              { 
                label: "User Engagement", 
                value: `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}%`,
                percentage: (stats.activeUsers / stats.totalUsers) * 100,
              },
              { 
                label: "Growth This Week", 
                value: `+${stats.newUsersThisWeek}`,
                percentage: Math.min((stats.newUsersThisWeek / 5) * 100, 100),
              },
            ].map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-white">{metric.label}</p>
                  <p className="text-lg font-bold text-primary">{metric.value}</p>
                </div>
                <div className="h-2 bg-black/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary/50 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.percentage}%` }}
                    transition={{ duration: 1.5, delay: 0.8 + index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="bg-card border border-primary/20 rounded-xl p-6 backdrop-blur-sm"
      >
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <MessageSquare className="text-primary" size={24} />
          Recent Activity Feed
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
          {[
            { time: "2 hours ago", activity: "New user registered", icon: Users, color: "text-blue-400" },
            { time: "5 hours ago", activity: "Video content uploaded", icon: Video, color: "text-purple-400" },
            { time: "1 day ago", activity: "1,250+ votes cast", icon: Flame, color: "text-red-400" },
            { time: "2 days ago", activity: "Platform maintenance completed", icon: Zap, color: "text-yellow-400" },
            { time: "3 days ago", activity: "New user milestone reached", icon: Award, color: "text-pink-400" },
          ].map((item, index) => {
            const Icon = item.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-black/50 transition-colors cursor-pointer group"
              >
                <div className={`p-2 rounded-lg bg-primary/10 ${item.color} group-hover:bg-primary/20 transition-colors`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{item.activity}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-primary/50 group-hover:bg-primary transition-colors" />
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </div>
  )
}
