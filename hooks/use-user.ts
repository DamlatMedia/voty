"use client"

import { useEffect, useState } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "user" | "admin"
  subscription: {
    status: "active" | "inactive"
    expiresAt: string
  }
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user")
        if (!response.ok) throw new Error("Failed to fetch user")
        const data = await response.json()
        setUser(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading, error }
}
