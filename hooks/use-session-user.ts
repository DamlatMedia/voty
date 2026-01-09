"use client"

import { useEffect, useState } from "react"

interface SessionUser {
  name: string
  email: string
  role: "user" | "admin"
  isSubscribed: boolean
  dateOfBirth?: string
  pic?: string
  id?: string
  created_at?: string
}

export function useSessionUser() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("votyUser")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser({
          id: parsedUser.id,
          name: parsedUser.name,
          email: parsedUser.email,
          role: parsedUser.role,
          isSubscribed: parsedUser.subscription_status === "active",
          dateOfBirth: parsedUser.date_of_birth,
          pic: parsedUser.pic,
          created_at: parsedUser.created_at,
        })
      } catch {
        setUser(null)
      }
    }
    setLoading(false)
  }, [])

  return { user, loading }
}
