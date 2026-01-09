"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Settings, LogOut, ChevronDown } from "lucide-react"
import { useSessionUser } from "@/hooks/use-session-user"
import { usePageSettings } from "@/hooks/use-page-settings"
import SettingsModal from "./settings-modal"

export default function DashboardHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [triviaCategories, setTriviaCategories] = useState<string[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [currentTab, setCurrentTab] = useState("home")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useSessionUser()
  const { settings, loading } = usePageSettings()

  // Fetch trivia categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        const response = await fetch("/api/trivia/categories")
        const result = await response.json()
        if (result.categories) {
          setTriviaCategories(result.categories)
        }
      } catch (error) {
        console.error("Failed to fetch trivia categories:", error)
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  // Update active tab based on URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const tab = searchParams.get("tab") || "home"
    setCurrentTab(tab)
  }, [pathname])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
          setOpenDropdown(null)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("votyToken")
    localStorage.removeItem("votyUser")
    router.push("/login")
  }

  const handleVideoSelect = (item: string) => {
    const categoryMap: Record<string, string> = {
      "All Videos": "?tab=videos",
      "Moral Stories": "?tab=videos",
      Trending: "?tab=videos",
      Recent: "?tab=videos",
      "Top Rated": "?tab=videos",
      Educational: "?tab=videos",
    }
    setCurrentTab("videos")
    router.push("/dashboard" + (categoryMap[item] || "?tab=videos"))
    setOpenDropdown(null)
    setIsOpen(false)
  }

  const handleQuizSelect = (item: string) => {
    // Trivia categories directly navigate to trivia view
    if (item === "Trivia" || triviaCategories.includes(item)) {
      const category = item === "Trivia" ? "all" : item
      sessionStorage.setItem("triviaCategory", category)
      setCurrentTab("quizzes")
      router.push("/dashboard?tab=quizzes&type=trivia")
    } else {
      // Live and Past go to regular quizzes
      setCurrentTab("quizzes")
      router.push("/dashboard?tab=quizzes")
    }
    setOpenDropdown(null)
    setIsOpen(false)
  }

  const handleVoteSelect = (item: string) => {
    setCurrentTab("voting")
    router.push("/dashboard?tab=voting")
    setOpenDropdown(null)
    setIsOpen(false)
  }

  const videoCategories = ["Moral Stories", "Trending", "Educational"]
  const quizFilters = ["Trivia"]
  const voteOptions = ["Trending", "Participating", "Results"]

  const navItems = [
    { href: "/dashboard", label: "Home", type: "link" as const },
    { href: "/dashboard?tab=videos", label: "Videos", type: "link" as const },
    {
      label: "Quizzes",
      type: "dropdown" as const,
      items: quizFilters,
      onSelect: handleQuizSelect,
    },
    {
      label: "Votes",
      type: "dropdown" as const,
      items: voteOptions,
      onSelect: handleVoteSelect,
    },
    { href: "/dashboard?tab=profile", label: "Profile", type: "link" as const },
  ]

  if (user?.role === "admin") {
    navItems.push({ href: "/dashboard/admin", label: "Admin", type: "link" as const })
  }

  const isActive = (item: any) => {
    if (item.type === "link") {
      if (item.label === "Home") {
        return currentTab === "home"
      }
      if (item.label === "Videos") {
        return currentTab === "videos"
      }
      if (item.label === "Profile") {
        return currentTab === "profile"
      }
      if (item.label === "Admin") {
        return pathname === item.href
      }
      return false
    } else {
      // For dropdowns, check if current tab matches the label
      const tabMap: Record<string, string> = {
        Videos: "videos",
        Quizzes: "quizzes",
        Votes: "voting",
      }
      return currentTab === tabMap[item.label]
    }
  }

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-md z-50 border-b border-primary/30">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex justify-between items-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/dashboard" onClick={() => setCurrentTab("home")} className="flex items-center gap-2 no-underline">
                {!loading && settings.site_image && (
                  <Image
                    src={settings.site_image}
                    alt={settings.site_name}
                    width={60}
                    height={60}
                    className="rounded-full object-cover"
                  />
                )}
                
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1" ref={dropdownRef}>
              {navItems.map((item) =>
                item.type === "link" ? (
                  <Link key={item.href} href={item.href} onClick={() => {
                    if (item.label === "Home") setCurrentTab("home")
                    else if (item.label === "Videos") setCurrentTab("videos")
                    else if (item.label === "Profile") setCurrentTab("profile")
                    else if (item.label === "Admin") setCurrentTab("admin")
                  }}>
                    <motion.div
                      className={`px-3 lg:px-4 py-2 rounded-lg transition-colors relative text-white hover:text-primary text-sm lg:text-base ${
                        isActive(item) ? "text-primary" : ""
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.label}
                      {isActive(item) && (
                        <motion.div
                          layoutId="underline"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.div>
                  </Link>
                ) : (
                  <div key={item.label} className="relative">
                    <motion.button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className={`px-3 lg:px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm lg:text-base relative ${
                        isActive(item) ? "text-primary" : "text-white hover:text-primary"
                      }`}
                      whileHover={{ scale: 1.05 }}
                    >
                      {item.label}
                      <ChevronDown
                        size={16}
                        className={`transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
                      />
                      {isActive(item) && (
                        <motion.div
                          layoutId="underline"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </motion.button>

                    <AnimatePresence>
                      {openDropdown === item.label && (
                        <motion.div
                          className="absolute top-full mt-2 bg-card border border-primary/30 rounded-lg shadow-lg min-w-max z-50 right-0 sm:left-0"
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                        >
                          {item.items?.map((subitem, idx) => (
                            <motion.button
                              key={idx}
                              onClick={() => item.onSelect?.(subitem)}
                              className="w-full text-left px-4 py-3 text-white hover:bg-primary/10 hover:text-primary transition-colors first:rounded-t-lg last:rounded-b-lg border-b border-primary/10 last:border-b-0 whitespace-nowrap text-sm"
                              whileHover={{ scale: 1.02, paddingLeft: "1.25rem" }}
                            >
                              {subitem}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ),
              )}
            </div>

            {/* Desktop Right Side */}
            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 lg:w-10 h-8 lg:h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 overflow-hidden flex-shrink-0">
                  {user?.pic ? (
                    <Image
                      src={user.pic}
                      alt={user.name || "Profile"}
                      width={40}
                      height={40}
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-primary font-bold text-xs lg:text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <span className="text-xs lg:text-sm text-white hidden lg:inline">{user?.name}</span>
              </div>
              <motion.button
                onClick={() => setIsSettingsOpen(true)}
                className="text-white hover:text-primary transition p-2"
                whileHover={{ scale: 1.1 }}
                aria-label="Settings"
              >
                <Settings size={20} />
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-primary p-2"
              whileHover={{ scale: 1.1 }}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={mobileMenuRef}
                className="md:hidden mt-4 space-y-2 pb-4 max-h-[70vh] overflow-y-auto"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                {navItems.map((item) =>
                  item.type === "link" ? (
                    <Link key={item.href} href={item.href} onClick={() => {
                      if (item.label === "Home") setCurrentTab("home")
                      else if (item.label === "Videos") setCurrentTab("videos")
                      else if (item.label === "Profile") setCurrentTab("profile")
                      else if (item.label === "Admin") setCurrentTab("admin")
                      setIsOpen(false)
                    }}>
                      <motion.div
                        className={`block px-4 py-2 rounded-lg text-sm ${
                          isActive(item) ? "bg-primary/20 text-primary" : "text-white hover:text-primary"
                        }`}
                      >
                        {item.label}
                      </motion.div>
                    </Link>
                  ) : (
                    <div key={item.label}>
                      <motion.button
                        onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                        className={`w-full text-left px-4 py-2 flex items-center justify-between rounded-lg text-sm transition-colors ${
                          isActive(item) ? "bg-primary/20 text-primary" : "text-white hover:text-primary"
                        }`}
                      >
                        {item.label}
                        <ChevronDown
                          size={16}
                          className={`transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
                        />
                      </motion.button>
                      <AnimatePresence>
                        {openDropdown === item.label && (
                          <motion.div
                            className="ml-2 mt-1 space-y-1 bg-primary/5 rounded-lg p-2"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            {item.items?.map((subitem, idx) => (
                              <motion.button
                                key={idx}
                                onClick={() => {
                                  item.onSelect?.(subitem)
                                  setIsOpen(false)
                                }}
                                className="w-full text-left px-4 py-2 text-white hover:text-primary hover:bg-primary/10 rounded-lg text-xs sm:text-sm transition-colors"
                              >
                                {subitem}
                              </motion.button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ),
                )}
                <button
                  onClick={() => {
                    setIsSettingsOpen(true)
                    setIsOpen(false)
                  }}
                  className="w-full text-left px-4 py-2 text-white hover:text-primary flex items-center gap-2 rounded-lg text-sm"
                >
                  <Settings size={18} /> Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-500/80 hover:text-red-500 flex items-center gap-2 rounded-lg text-sm"
                >
                  <LogOut size={18} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} onLogout={handleLogout} />
    </>
  )
}
