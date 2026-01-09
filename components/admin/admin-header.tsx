"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { LogOut, Menu, X, Settings } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { usePageSettings } from "@/hooks/use-page-settings"

interface AdminHeaderProps {
  admin: {
    id: string
    name: string
    email: string
    pic?: string
  }
  onMenuToggle: (open: boolean) => void
  onSettingsClick: () => void
}

export default function AdminHeader({ admin, onMenuToggle, onSettingsClick }: AdminHeaderProps) {
  const router = useRouter()
  const [showLogoutMenu, setShowLogoutMenu] = useState(false)
  const { settings } = usePageSettings()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("votyUser")
    localStorage.removeItem("votyToken")
    router.push("/admin/login")
  }

  return (
    <motion.header
      className="fixed top-0 right-0 left-0 z-40 bg-black/95 backdrop-blur-sm border-b border-primary/20 lg:left-72"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between px-4 md:px-6 py-3 h-20">
        {/* VOTY Logo */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center justify-center rounded-full overflow-hidden ring-1 ring-primary/20" style={{ width: 44, height: 44 }}>
            {isClient && settings.site_image ? (
              <Image
                src={settings.site_image}
                alt={settings.site_name}
                width={44}
                height={44}
                className="object-cover"
                priority
              />
            ) : (
              <Image
                src="/voty-logo.png"
                alt="Logo"
                width={44}
                height={44}
                className="object-cover"
                priority
              />
            )}
          </div>
          <h1 className="text-xl font-bold text-primary"> Admin</h1>
        </div>

        {/* Mobile Menu Toggle */}
        <motion.button
          className="lg:hidden text-primary hover:text-primary/80 transition"
          onClick={() => onMenuToggle(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open menu"
        >
          <Menu size={24} />
        </motion.button>

        {/* Admin Info */}
        <div className="flex-1 flex items-center justify-end gap-4">
          {/* Settings Button */}
          <motion.button
            onClick={onSettingsClick}
            className="p-2 rounded-lg bg-card hover:bg-card/80 text-primary transition"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Settings"
          >
            <Settings size={20} />
          </motion.button>

          {/* Admin Avatar & Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setShowLogoutMenu(!showLogoutMenu)}
              className="flex items-center gap-3 p-2 rounded-lg bg-card hover:bg-card/80 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2 hidden sm:flex">
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{admin.name || "Admin"}</p>
                  <p className="text-xs text-muted-foreground">{admin.email}</p>
                </div>
              </div>
              <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary">
                <Image
                  src={admin.pic || "/placeholder-user.jpg"}
                  alt={admin.name || "Admin"}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.button>

            {/* Logout Menu */}
            {showLogoutMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full right-0 mt-2 bg-card border border-primary/20 rounded-lg shadow-xl p-2 min-w-[180px]"
              >
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
