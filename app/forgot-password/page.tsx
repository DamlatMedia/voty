"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Header from "@/components/header"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const handleResetPassword = () => {
    if (email) {
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        setEmail("")
      }, 5000)
    }
  }

  return (
    <main className="bg-black min-h-screen">
      <Header isScrolled={isScrolled} />

      <div className="flex items-center justify-center min-h-screen pt-20 pb-10 px-4">
        <motion.div
          className="w-full max-w-md bg-card border border-primary/20 rounded-2xl p-8 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              href="/"
              className="text-4xl font-bold text-primary hover:text-primary/80 transition-colors mb-4 inline-block"
            >
              VOTY
            </Link>
            <h1 className="text-3xl font-bold text-foreground mt-4">Reset Password</h1>
            <p className="text-muted-foreground mt-2">Enter your email to receive a reset link</p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>

            <button
              onClick={handleResetPassword}
              disabled={!email}
              className="w-full py-3 bg-primary text-black rounded-lg font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-gold-hover"
            >
              Send Reset Link
            </button>
          </div>

          <p className="text-center text-muted-foreground mt-6">
            Remember your password?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Login
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0, y: -50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0, y: 50 }}
              className="bg-card border border-primary/20 rounded-2xl p-8 text-center max-w-md mx-4"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1], rotate: [0, 360, 0] }}
                transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
                className="text-6xl mb-4"
              >
                ✓
              </motion.div>
              <h2 className="text-2xl font-bold text-primary mb-2">Reset Link Sent!</h2>
              <p className="text-foreground mb-4">We've sent a password reset link to</p>
              <p className="text-primary font-medium mb-4">{email}</p>
              <p className="text-muted-foreground text-sm">
                Please check your email and click the reset link to create a new password.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
