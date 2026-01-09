"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Menu, X, LogOut, Settings } from "lucide-react"
import SettingsModal from "./settings-modal"

export default function DashboardNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("userName")
    router.push("/login")
  }

  const navItems = [
    { href: "/dashboard", label: "Home" },
    { href: "/dashboard/videos", label: "Videos" },
    { href: "/dashboard/quizzes", label: "Quizzes" },
    { href: "/dashboard/profile", label: "Profile" },
  ]

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-md z-50 border-b border-primary/30">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex justify-between items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/" className="text-2xl font-bold text-gold">
              
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <motion.div key={item.href} whileHover={{ color: "#D4AF37" }}>
                  <Link href={item.h
                    ref} className="text-white transition">
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.button
                onClick={() => setIsSettingsOpen(true)}
                className="text-white hover:text-gold transition p-2"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Settings"
              >
                <Settings size={20} />
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gold p-2"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <motion.div
              className="md:hidden mt-4 space-y-3 pb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Link href="/dashboard" className="block text-white hover:text-gold py-2">
                Home
              </Link>
              <Link href="/dashboard/videos" className="block text-white hover:text-gold py-2">
                Videos
              </Link>
              <Link href="/dashboard/quizzes" className="block text-white hover:text-gold py-2">
                Quizzes
              </Link>
              <Link href="/dashboard/profile" className="block text-white hover:text-gold py-2">
                Profile
              </Link>
              <button
                onClick={() => {
                  setIsSettingsOpen(true)
                  setIsOpen(false)
                }}
                className="w-full text-left text-white hover:text-gold py-2 flex items-center gap-2"
              >
                <Settings size={18} /> Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left text-destructive hover:text-red-400 py-2 flex items-center gap-2"
              >
                <LogOut size={18} /> Logout
              </button>
            </motion.div>
          )}
        </div>
      </nav>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  )
}
