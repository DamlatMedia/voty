// ...existing code...
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { usePageSettings } from "@/hooks/use-page-settings"

interface HeaderProps {
  isScrolled: boolean
}

export default function Header({ isScrolled }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { settings, mounted } = usePageSettings()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <motion.header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-black/75 backdrop-blur-sm border-b border-primary/10"
          : "bg-transparent"
      }`}
      initial={{ y: 0 }}
      animate={{ y: 0 }}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - compact + sleek */}
          <Link
            href="/"
            className="flex items-center gap-3 no-underline select-none"
            aria-label=""
          >
            <div
              className={`flex items-center justify-center rounded-full overflow-hidden ring-1 ring-primary/20 transition-all duration-200 ${
                isScrolled ? "shadow-md" : "shadow-sm"
              }`}
              style={{ width: 44, height: 44 }}
            >
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
                  alt="VOTY Logo"
                  width={44}
                  height={44}
                  className="object-cover"
                  priority
                />
              )}
            </div>

            {/* <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-lg sm:text-xl font-semibold text-primary">{isClient ? settings.site_name : 'VOTY'}</span>
              <span className="text-[10px] text-muted-foreground -mt-0.5">{isClient ? settings.brand_tagline : 'Voice of the Youth'}</span>
            </div> */}
          </Link>

          {/* Desktop Menu - minimal, iOS-like */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              Home
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              About
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              Contact
            </Link>

            <div className="flex items-center gap-3 ml-2">
              <Link
                href="/login"
                className="text-sm px-3 py-1.5 rounded-full border border-transparent text-primary hover:bg-primary/10 transition"
              >
                Login
              </Link>

              <Link
                href="/sign-up"
                className="text-sm px-3 py-1.5 rounded-full bg-primary text-black font-semibold shadow-sm hover:brightness-95 transition"
              >
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-full hover:bg-white/5 transition"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={isOpen ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
          className="md:hidden overflow-hidden"
        >
          <div className="mt-3 pb-3 flex flex-col gap-2">
            <Link href="/" className="px-3 py-2 rounded-md text-foreground hover:bg-white/5 transition">
              Home
            </Link>
            <Link href="/about" className="px-3 py-2 rounded-md text-foreground hover:bg-white/5 transition">
              About
            </Link>
            <Link href="/contact" className="px-3 py-2 rounded-md text-foreground hover:bg-white/5 transition">
              Contact
            </Link>
            <div className="px-3 pt-2 flex gap-2">
              <Link href="/login" className="flex-1 text-center px-3 py-2 rounded-full border border-primary/20 text-primary">
                Login
              </Link>
              <Link href="/sign-up" className="flex-1 text-center px-3 py-2 rounded-full bg-primary text-black font-semibold">
                Sign Up
              </Link>
            </div>
          </div>
        </motion.div>
      </nav>
    </motion.header>
  )
}
// ...existing code...