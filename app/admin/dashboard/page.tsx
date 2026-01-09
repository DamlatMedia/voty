"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminOverviewNew from "@/components/admin/admin-overview-new"
import AdminUsers from "@/components/admin/admin-users"
import AdminVideos from "@/components/admin/admin-videos"
import AdminProfile from "@/components/admin/admin-profile"
import PageSettings from "@/components/admin/admin-page-settings"
import AdminTrivia from "@/components/admin/admin-trivia"

interface SessionAdmin {
  id: string
  name: string
  email: string
  role: "admin"
  is_super?: boolean
  pic?: string
  created_at?: string
  updated_at?: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState<SessionAdmin | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVideos: 0,
    totalVotes: 0,
    activeUsers: 0,
    totalQuizzes: 0,
    avgEngagementRate: 0,
    newUsersThisWeek: 0,
    videosThisWeek: 0,
  })

  useEffect(() => {
    const storedUser = localStorage.getItem("votyUser")

    if (!storedUser) {
      router.push("/admin/login")
      return
    }

    try {
      const parsedAdmin = JSON.parse(storedUser)

      if (parsedAdmin.role !== "admin") {
        router.push("/admin/login")
        return
      }

      setAdmin({
        id: parsedAdmin.id,
        name: parsedAdmin.name,
        email: parsedAdmin.email,
        role: parsedAdmin.role,
        is_super: parsedAdmin.is_super,
        pic: parsedAdmin.pic,
        created_at: parsedAdmin.created_at,
        updated_at: parsedAdmin.updated_at,
      })

      // Fetch dashboard stats
      fetchStats()
      setLoading(false)
    } catch {
      router.push("/admin/login")
    }
  }, [router])

  const fetchStats = async () => {
    try {
      // Fetch users count and calculate new users this week
      const usersResponse = await fetch("/api/admin/users")
      const usersData = await usersResponse.json()
      const allUsers = usersData.users || []
      
      // Calculate new users this week
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      const newUsersThisWeek = allUsers.filter((user: any) => {
        const createdDate = new Date(user.created_at)
        return createdDate > oneWeekAgo
      }).length

      // Fetch videos count and calculate videos this week
      const videosResponse = await fetch("/api/admin/videos")
      const videosData = await videosResponse.json()
      const allVideos = videosData.videos || []
      
      const videosThisWeek = allVideos.filter((video: any) => {
        const createdDate = new Date(video.created_at)
        return createdDate > oneWeekAgo
      }).length

      // Calculate total votes (sum of all vote_count from videos)
      const totalVotes = allVideos.reduce((sum: number, video: any) => sum + (video.vote_count || 0), 0)

      // Calculate engagement rate (votes per video)
      const avgEngagementRate = allVideos.length > 0 ? Math.round((totalVotes / allVideos.length) * 10) / 10 : 0

      // Calculate active users (users with activity in last 30 days)
      // Active users are those who have viewed a video or voted in the last 30 days
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      const activeUsers = allUsers.filter((user: any) => {
        const lastActivityDate = user.updated_at ? new Date(user.updated_at) : new Date(user.created_at)
        return lastActivityDate > thirtyDaysAgo
      }).length

      setStats({
        totalUsers: allUsers.length,
        totalVideos: allVideos.length,
        totalVotes: totalVotes,
        activeUsers: activeUsers,
        totalQuizzes: 0, // Will be fetched if quiz table exists
        avgEngagementRate: avgEngagementRate,
        newUsersThisWeek: newUsersThisWeek,
        videosThisWeek: videosThisWeek,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
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
      {/* Header */}
      {admin && (
        <AdminHeader
          admin={admin}
          onMenuToggle={setSidebarOpen}
          onSettingsClick={() => setActiveTab("profile")}
        />
      )}

      <div className="flex flex-1 pt-20">
        {/* Sidebar */}
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Main Content */}
        <main className="flex-1 px-4 md:px-6 py-8 max-w-7xl mx-auto w-full">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "overview" && <AdminOverviewNew stats={stats} />}
            {activeTab === "users" && <AdminUsers adminId={admin?.id || ""} />}
            {activeTab === "videos" && <AdminVideos adminId={admin?.id || ""} />}
            {activeTab === "trivia" && <AdminTrivia adminId={admin?.id || ""} />}
            {activeTab === "profile" && admin && (
              <AdminProfile
                admin={admin}
                onProfileUpdate={(updatedAdmin) => setAdmin(updatedAdmin)}
              />
            )}
            {activeTab === "settings" && admin && (
              <PageSettings adminId={admin?.id || ""} />
            )}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
