"use client"

import { useEffect, useState } from "react"

export function useRealTimeCount(initialCount: number, updateInterval = 5000) {
  const [count, setCount] = useState(initialCount)

  useEffect(() => {
    // Simulate live count updates with small random increments (demo)
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 5))
    }, updateInterval)

    return () => clearInterval(interval)
  }, [updateInterval])

  return count
}
