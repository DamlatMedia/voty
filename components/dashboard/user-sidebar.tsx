"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Home,
  Play,
  HelpCircle,
  ThumbsUp,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Star,
} from "lucide-react"

interface UserSidebarProps {
  isOpen: boolean
  onClose: () => void
  onToggle: () => void
  activeTab: string
  onTabChange: (tab: string) => void
  user: {
    id: string
    name: string
    email: string
    pic?: string
    subscription_status?: string
  } | null
  onLogout: () => void
}

export default function UserSidebar({
  isOpen,
  onClose,
  onToggle,
  activeTab,
  onTabChange,
  user,
  onLogout,
}: UserSidebarProps) {
  const navigationItems = [
    { id: "home", label: "Home", icon: Home, badge: null },
    { id: "videos", label: "Videos", icon: Play, badge: "New" },
    { id: "quizzes", label: "Quizzes", icon: HelpCircle, badge: null },
    { id: "voting", label: "Voting", icon: ThumbsUp, badge: "Trending" },
  ]

  const settingsItems = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ]

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
            className="fixed inset-0 bg-black/50 md:hidden z-20 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-screen w-72 bg-black border-r border-primary/10 md:static md:translate-x-0 z-30 overflow-y-auto flex flex-col hidden md:flex"
      >
        <div className="p-6 space-y-8 flex-1">
          {/* Header Section with Logo and Close */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div whileHover={{ scale: 1.05 }} className="relative w-10 h-10">
                <Image src="/voty-logo.png" alt="VOTY" fill className="object-contain" />
              </motion.div>
            </Link>
            <motion.button
              onClick={onClose}
              className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={24} className="text-primary" />
            </motion.button>
          </div>

          {/* User Profile Section */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-primary/10 border border-primary/20 rounded-lg space-y-3"
            >
              <div className="flex items-center gap-3">
                {user.pic ? (
                  <Image
                    src={user.pic}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full border-2 border-primary/30 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full border-2 border-primary/30 bg-primary/20 flex items-center justify-center">
                    <User size={24} className="text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-primary/20">
                <p className="text-xs uppercase font-bold text-primary tracking-wider">
                  {user.subscription_status || "free"} Plan
                </p>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <nav className="space-y-2">
            <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-4">
              Explore
            </p>
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative ${
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/50"
                      : "text-white hover:bg-primary/10"
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={20} />
                  <span className="font-medium flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xs bg-primary text-black px-2 py-1 rounded-full font-bold"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-l-full"
                    />
                  )}
                </motion.button>
              )
            })}
          </nav>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0" />

          {/* Settings */}
          <nav className="space-y-2">
            <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-4">
              Account
            </p>
            {settingsItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative ${
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/50"
                      : "text-white hover:bg-primary/10"
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={20} />
                  <span className="font-medium flex-1 text-left">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-l-full"
                    />
                  )}
                </motion.button>
              )
            })}
          </nav>
        </div>

        {/* Premium Banner */}
        {user?.subscription_status === "free" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 border-t border-primary/10 space-y-3"
          >
            <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg text-center space-y-3">
              <div className="flex justify-center">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Star className="text-primary" size={28} />
                </motion.div>
              </div>
              <div>
                <p className="text-sm font-bold text-white mb-1">Upgrade to Pro</p>
                <p className="text-xs text-muted-foreground">Unlock premium features</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 py-2 bg-primary text-black font-bold rounded-lg transition-colors"
              >
                Upgrade Now
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Logout Button */}
        <div className="p-6 border-t border-primary/10">
          <motion.button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </motion.button>
        </div>
      </motion.aside>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 h-screen w-72 bg-black border-r border-primary/10 md:hidden z-30 overflow-y-auto flex flex-col"
      >
        <div className="p-6 space-y-8 flex-1">
          {/* Header Section with Logo and Close */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <motion.div whileHover={{ scale: 1.05 }} className="relative w-10 h-10">
                <Image src="/voty-logo.png" alt="VOTY" fill className="object-contain" />
              </motion.div>
            </Link>
            <motion.button
              onClick={onClose}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={24} className="text-primary" />
            </motion.button>
          </div>

          {/* User Profile Section */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-primary/10 border border-primary/20 rounded-lg space-y-3"
            >
              <div className="flex items-center gap-3">
                {user.pic ? (
                  <Image
                    src={user.pic}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-full border-2 border-primary/30 object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full border-2 border-primary/30 bg-primary/20 flex items-center justify-center">
                    <User size={24} className="text-primary" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-primary/20">
                <p className="text-xs uppercase font-bold text-primary tracking-wider">
                  {user.subscription_status || "free"} Plan
                </p>
              </div>
            </motion.div>
          )}

          {/* Navigation */}
          <nav className="space-y-2">
            <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-4">
              Explore
            </p>
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative ${
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/50"
                      : "text-white hover:bg-primary/10"
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={20} />
                  <span className="font-medium flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-xs bg-primary text-black px-2 py-1 rounded-full font-bold"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-l-full"
                    />
                  )}
                </motion.button>
              )
            })}
          </nav>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0" />

          {/* Settings */}
          <nav className="space-y-2">
            <p className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-4">
              Account
            </p>
            {settingsItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group relative ${
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/50"
                      : "text-white hover:bg-primary/10"
                  }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon size={20} />
                  <span className="font-medium flex-1 text-left">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-l-full"
                    />
                  )}
                </motion.button>
              )
            })}
          </nav>
        </div>

        {/* Premium Banner */}
        {user?.subscription_status === "free" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 border-t border-primary/10 space-y-3"
          >
            <div className="p-4 bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 rounded-lg text-center space-y-3">
              <div className="flex justify-center">
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Star className="text-primary" size={28} />
                </motion.div>
              </div>
              <div>
                <p className="text-sm font-bold text-white mb-1">Upgrade to Pro</p>
                <p className="text-xs text-muted-foreground">Unlock premium features</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full px-4 py-2 bg-primary text-black font-bold rounded-lg transition-colors"
              >
                Upgrade Now
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Logout Button */}
        <div className="p-6 border-t border-primary/10">
          <motion.button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </motion.button>
        </div>
      </motion.aside>
    </>
  )
}
