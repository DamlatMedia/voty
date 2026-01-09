"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"
import { useToastSimple } from "@/hooks/use-toast-simple"
import { ToastDisplay } from "@/components/toast-display"

export default function Login() {
  const router = useRouter()
  const { toasts, showToast, removeToast } = useToastSimple()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    if (email && password) {
      setError("")
      setIsLoading(true)

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })

        const data = await response.json()

        console.log("API Response:", data)

        if (data.success) {
          console.log("User data being stored:", data.user)
          localStorage.setItem("votyToken", data.token)
          localStorage.setItem("votyUser", JSON.stringify(data.user))
          console.log("Stored in localStorage:", localStorage.getItem("votyUser"))

          showToast("Login successful! Redirecting to dashboard...", "success")
          
          // Redirect to dashboard after brief delay
          setTimeout(() => {
            router.push("/dashboard")
          }, 100)
        } else {
          setError(data.message || "Invalid email or password")
          showToast(data.message || "Invalid email or password", "error")
          setIsLoading(false)
        }
      } catch (err) {
        setError("An error occurred. Please try again.")
        showToast("An error occurred. Please try again.", "error")
        setIsLoading(false)
      }
    }
  }

  return (
    <main className="bg-black min-h-screen flex items-center justify-center px-4">
      <ToastDisplay toasts={toasts} onRemove={removeToast} />
      
      <motion.div
        className="w-full max-w-md bg-card border border-primary/20 rounded-2xl p-8 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with VOTY Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="flex justify-center mb-4"
          >
            <Image
              src="/voty-logo.png"
              alt="VOTY Logo"
              width={80}
              height={80}
              priority
              className="object-contain"
            />
          </motion.div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="text-muted-foreground mt-2">Continue your journey with us</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Email or Username</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email or username"
              className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-primary hover:text-primary/80 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </motion.button>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Forgot Password?
            </Link>
          </div>

           <button
            type="button"
            onClick={handleLogin}
            disabled={!email || !password || isLoading}
            className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
              isLoading
                ? "bg-primary/70 text-white cursor-not-allowed"
                : "bg-primary text-white hover:bg-primary/90 glow-gold-hover"
            } ${!email || !password ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <svg
                  className="h-5 w-5 animate-spin text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                <span>Signing in...</span>
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </div>

        <p className="text-center text-muted-foreground mt-6">
          Don't have an account?{" "}
          <Link href="/sign-up" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </main>
  )
}
