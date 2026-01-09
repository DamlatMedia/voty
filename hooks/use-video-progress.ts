"use client"

import { useEffect, useState } from "react"

interface VideoProgress {
  videoId: string
  progress: number
  duration: number
  lastWatched: string
}

export function useVideoProgress(videoId: string) {
  const [progress, setProgress] = useState<VideoProgress | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`/api/progress/${videoId}`)
        if (response.ok) {
          const data = await response.json()
          setProgress(data)
        }
      } catch (error) {
        console.error("Failed to fetch progress:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [videoId])

  const updateProgress = async (currentProgress: number, duration: number) => {
    try {
      await fetch(`/api/progress/${videoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ progress: currentProgress, duration }),
      })
    } catch (error) {
      console.error("Failed to update progress:", error)
    }
  }

  return { progress, loading, updateProgress }
}
