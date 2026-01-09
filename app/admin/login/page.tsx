"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import Image from "next/image"

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        // Check if user is admin
        if (data.user.role !== "admin") {
          setError("You do not have admin access. Only administrators can access this area.")
          setIsLoading(false)
          return
        }

        localStorage.setItem("votyToken", data.token)
        localStorage.setItem("votyUser", JSON.stringify(data.user))
        setShowSuccess(true)

        // Redirect to admin dashboard
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 100)
      } else {
        setError(data.message || "Invalid email or password")
        setIsLoading(false)
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <main className="bg-black min-h-screen flex items-center justify-center px-4">
      <motion.div
        className="w-full max-w-md bg-card border border-primary/20 rounded-2xl p-8 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Image
              src="/voty-logo.png"
              alt="VOTY Logo"
              width={120}
              height={120}
              className="w-32 h-32 object-contain drop-shadow-lg"
              priority
            />
          </div>
          <h2 className="text-3xl font-bold text-white">Admin Login</h2>
          <p className="text-muted-foreground mt-2">Access the admin dashboard</p>
        </div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your admin email"
              className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-primary hover:text-primary/80 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading || showSuccess}
            className="w-full py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-black font-bold rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 size={20} />
                </motion.div>
                <span>Logging in...</span>
              </>
            ) : (
              "Login as Admin"
            )}
          </button>
        </div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-500 text-center text-sm"
            >
              Login successful! Redirecting...
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  )
}
