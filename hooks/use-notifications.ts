"use client"

import { useState, useCallback } from "react"

interface Notification {
  id: string
  type: "success" | "error" | "info"
  message: string
  duration?: number
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback(
    (message: string, type: "success" | "error" | "info" = "info", duration = 3000) => {
      const id = Date.now().toString()
      setNotifications((prev) => [...prev, { id, type, message, duration }])

      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id)
        }, duration)
      }

      return id
    },
    [],
  )

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  return {
    notifications,
    addNotification,
    removeNotification,
  }
}
