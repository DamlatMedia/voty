"use client"

import { useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { useSessionUser } from "@/hooks/use-session-user"
import { motion } from "framer-motion"

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: "admin" | "user"
}

export function ProtectedRoute({ children, requiredRole = "user" }: ProtectedRouteProps) {
  const router = useRouter()
  const { user, loading } = useSessionUser()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }

    if (!loading && user && requiredRole === "admin" && user.role !== "admin") {
      router.push("/dashboard")
      return
    }
  }, [user, loading, router, requiredRole])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
          <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full" />
        </motion.div>
      </div>
    )
  }

  if (!user || (requiredRole === "admin" && user.role !== "admin")) {
    return null
  }

  return <>{children}</>
}
