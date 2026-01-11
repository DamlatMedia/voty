"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  ChevronRight,
  Star,
  Play,
  ThumbsUp,
  User,
  Users,
  Settings,
  Zap,
} from "lucide-react"
import NextDynamic from "next/dynamic"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { createClient } from "@/lib/supabase/client"

// Lazy load components
const VideosGrid = NextDynamic(() => import("@/components/dashboard/videos-grid"), {
  loading: () => <LoadingSkeleton />,
})

const QuizGrid = NextDynamic(() => import("@/components/dashboard/quiz-grid"), {
  loading: () => <LoadingSkeleton />,
})

const VotingSection = NextDynamic(() => import("@/components/dashboard/voting-section"), {
  loading: () => <LoadingSkeleton />,
})

const TriviaQuestions = NextDynamic(() => import("@/components/dashboard/trivia-questions"), {
  loading: () => <LoadingSkeleton />,
})

interface User {
  id: string
  name: string
  email: string
  pic?: string
  subscription_status?: string
}

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("home")
  const [triviaCategory, setTriviaCategory] = useState<string>("all")
  const [stats, setStats] = useState({ watching: 0, completed: 0, votes: 0 })
  const [statsLoading, setStatsLoading] = useState(true)
  const [supabase, setSupabase] = useState<any>(null)

  useEffect(() => {
    setSupabase(createClient())
  }, [])

  useEffect(() => {
    const tabParam = searchParams.get("tab")
    if (tabParam) {
      setActiveTab(tabParam)
    } else {
      // If no tab param, default to home
      setActiveTab("home")
    }

    // Get trivia category from sessionStorage if trivia is being accessed
    const type = searchParams.get("type")
    if (type === "trivia") {
      const savedCategory = sessionStorage.getItem("triviaCategory")
      if (savedCategory) {
        setTriviaCategory(savedCategory)
      }
    }
  }, [searchParams])

  useEffect(() => {
    const storedUser = localStorage.getItem("votyUser")
    if (!storedUser) {
      router.push("/login")
      return
    }

    try {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
      setLoading(false)
    } catch {
      router.push("/login")
    }
  }, [router])

  // Fetch stats when user changes
  useEffect(() => {
    if (user) {
      fetchStats()
    }
  }, [user?.id])

  const fetchStats = async () => {
    try {
      setStatsLoading(true)
      
      // Get total videos count
      const { count: totalVideos, error: videosError } = await supabase
        .from('videos')
        .select('id', { count: 'exact', head: true })

      // Get user's completed videos count
      if (!user) {
        setStatsLoading(false)
        return
      }

      const { count: completedCount, error: completedError } = await supabase
        .from('video_progress')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'completed')

      const newStats = {
        watching: totalVideos || 0,
        completed: completedCount || 0,
        votes: 0,
      }

      setStats(newStats)
      console.log("Dashboard stats loaded:", newStats)
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    } finally {
      setStatsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("votyToken")
    localStorage.removeItem("votyUser")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="bg-black min-h-screen flex flex-col">
      {/* Main Content - Full Width */}
      <main className="flex-1 overflow-y-auto pt-20">
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Greeting Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30 backdrop-blur-xl p-8 md:p-12"
                >
                  {/* Background accent elements */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-0 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-72 h-72 bg-primary/3 rounded-full blur-3xl -z-0 pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white"
                      >
                        Welcome back, <span className="text-primary">{user?.name?.split(" ")[0]}</span>
                      </motion.h1>
                    </div>
                    <motion.p
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                      className="text-base md:text-lg text-muted-foreground/80 mb-2"
                    >
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </motion.p>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-sm text-muted-foreground/60"
                    >
                      Keep up the great work! You're making progress every day.
                    </motion.p>
                  </div>
                </motion.div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: "Available Videos", value: stats.watching, icon: Play, color: "from-blue-500/20 to-blue-500/5" },
                    { label: "Votes", value: stats.completed, icon: Star, color: "from-yellow-500/20 to-yellow-500/5" },
                    { label: "Community Participants", value: stats.votes, icon: Users, color: "from-purple-500/20 to-purple-500/5" },
                  ].map((stat, i) => {
                    const Icon = stat.icon
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`bg-gradient-to-br ${stat.color} border border-primary/20 rounded-xl p-6 backdrop-blur-sm hover:border-primary/40 transition-all duration-300`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-muted-foreground text-sm mb-1 font-medium">{stat.label}</p>
                            <p className="text-3xl font-bold text-white">{statsLoading ? "..." : stat.value}</p>
                          </div>
                          <Icon className="text-primary/60" size={32} />
                        </div>
                      </motion.div>
                    )
                  })}
                </div>

                {/* Featured Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-white mb-4">Continue Watching</h2>
                  <VideosGrid onVideoClose={fetchStats} />
                </motion.div>
              </motion.div>
            )}

            {activeTab === "videos" && (
              <motion.div
                key="videos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-white mb-2">Video Library</h1>
                  <p className="text-muted-foreground">Explore our collection of educational content</p>
                </div>
                <VideosGrid onVideoClose={fetchStats} />
              </motion.div>
            )}

            {activeTab === "quizzes" && (
              <motion.div
                key="quizzes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {searchParams.get("type") === "trivia" ? "Trivia Questions" : "Quizzes"}
                  </h1>
                  <p className="text-muted-foreground">Test your knowledge and earn rewards</p>
                </div>
                {searchParams.get("type") === "trivia" ? (
                  <TriviaQuestions category={triviaCategory} />
                ) : (
                  <QuizGrid />
                )}
              </motion.div>
            )}

            {activeTab === "voting" && (
              <motion.div
                key="voting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-white mb-2">Voting</h1>
                  <p className="text-muted-foreground">Cast your votes and make your voice heard</p>
                </div>
                <VotingSection />
              </motion.div>
            )}

            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="max-w-2xl">
                  <h1 className="text-3xl font-bold text-white mb-6">My Profile</h1>
                  
                  <div className="bg-card border border-primary/20 rounded-xl p-8 backdrop-blur-sm">
                    {/* Profile Header */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-primary/10">
                      {user?.pic ? (
                        <Image
                          src={user.pic}
                          alt={user.name}
                          width={120}
                          height={120}
                          className="w-28 h-28 rounded-full border-4 border-primary/30 object-cover"
                        />
                      ) : (
                        <div className="w-28 h-28 rounded-full border-4 border-primary/30 bg-primary/10 flex items-center justify-center">
                          <User size={48} className="text-primary" />
                        </div>
                      )}
                      <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-white mb-2">{user?.name}</h2>
                        <p className="text-muted-foreground mb-4">{user?.email}</p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-2 bg-primary text-black font-bold rounded-lg transition-colors"
                        >
                          Edit Profile
                        </motion.button>
                      </div>
                    </div>

                    {/* Profile Info */}
                    <div className="mt-8 space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Subscription Plan</p>
                          <p className="text-lg font-bold text-white capitalize">
                            {user?.subscription_status || "Free"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Member Since</p>
                          <p className="text-lg font-bold text-white">
                            {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-3xl font-bold text-white mb-6">Settings</h1>
                <div className="max-w-2xl space-y-4">
                  {[
                    { label: "Notifications", icon: Zap },
                    { label: "Privacy", icon: Settings },
                    { label: "Preferences", icon: User },
                  ].map((setting, i) => {
                    const Icon = setting.icon
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-card border border-primary/20 rounded-lg p-4 flex items-center justify-between hover:bg-card/80 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="text-primary" size={20} />
                          <span className="text-white font-medium">{setting.label}</span>
                        </div>
                        <ChevronRight className="text-muted-foreground group-hover:text-primary transition-colors" size={20} />
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
