"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, BarChart3, Users, Video, User, Settings, LogOut, HelpCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface AdminSidebarProps {
  isOpen: boolean
  onClose: () => void
  activeTab: string
  onTabChange: (tab: string) => void
}

const navItems = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "users", label: "Users", icon: Users },
  { id: "videos", label: "Videos", icon: Video },
  { id: "trivia", label: "Trivia Questions", icon: HelpCircle },
  { id: "profile", label: "My Profile", icon: User },
  { id: "settings", label: "Page Settings", icon: Settings },
]

export default function AdminSidebar({ isOpen, onClose, activeTab, onTabChange }: AdminSidebarProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("votyUser")
    localStorage.removeItem("votyToken")
    router.push("/admin/login")
  }

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId)
    onClose()
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 lg:hidden z-30"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-screen w-72 bg-black border-r border-primary/20 z-40 lg:static lg:translate-x-0 lg:!transform-none lg:!animate-none pt-20 lg:pt-0"
      >
        <div className="flex flex-col h-full">
          {/* Close Button (Mobile) */}
          <motion.button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 text-primary hover:text-primary/80 transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Close menu"
          >
            <X size={24} />
          </motion.button>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    activeTab === item.id
                      ? "bg-primary text-black"
                      : "text-white hover:bg-primary/10"
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              )
            })}
          </nav>

          {/* Logout Button */}
          <div className="px-4 py-4 border-t border-primary/20">
            <motion.button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </>
  )
}
