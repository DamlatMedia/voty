"use client"

import { motion } from "framer-motion"
import { Play, Users, Clock, CheckCircle2, RotateCcw } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface VideoCardProps {
  video: {
    id: string | number
    title: string
    description?: string
    subtitle?: string
    thumbnail?: string
    thumb?: string
    participants: number
    duration?: string
  }
  onSelect?: (video: any) => void
  refreshTrigger?: number
}

interface ProgressData {
  status: 'not_started' | 'watching' | 'completed'
  progress: number
  total_duration_seconds: number
}

export default function VideoCard({ video, onSelect, refreshTrigger }: VideoCardProps) {
  const participantCount = video.participants ?? 0
  const thumbnailUrl = video.thumbnail || video.thumb || "/placeholder.svg"
  const [supabase, setSupabase] = useState<any>(null)
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSupabase(createClient())
  }, [])

  useEffect(() => {
    if (!supabase) return
    const fetchProgress = async () => {
      try {
        // Get current user from Supabase auth, fall back to localStorage `votyUser`
        let user: any = null
        try {
          const authRes = await supabase.auth.getUser()
          user = authRes?.data?.user ?? null
        } catch (e) {
          user = null
        }

        if (!user) {
          try {
            const stored = typeof window !== 'undefined' ? localStorage.getItem('votyUser') : null
            if (stored) user = JSON.parse(stored)
          } catch (e) {
            user = null
          }
        }

        if (!user) {
          console.log("User not authenticated, skipping progress fetch")
          setLoading(false)
          return
        }

        // Query video_progress table directly using Supabase client
        const { data: progressData, error } = await supabase
          .from('video_progress')
          .select('progress_seconds, total_duration_seconds, status')
          .eq('user_id', user.id)
          .eq('video_id', video.id)
          .maybeSingle()

        if (error) {
          console.error("Failed to fetch progress:", error)
          setProgress(null)
        } else if (progressData) {
          setProgress({
            status: (progressData.status as any) || 'not_started',
            progress: progressData.progress_seconds || 0,
            total_duration_seconds: progressData.total_duration_seconds || 0,
          })
        } else {
          setProgress(null)
        }
      } catch (error) {
        console.error("Failed to fetch progress:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProgress()
  }, [video.id, supabase, refreshTrigger])

  const progressPercentage = progress && progress.total_duration_seconds > 0
    ? Math.min((progress.progress / progress.total_duration_seconds) * 100, 100)
    : 0

  const getStatusColor = () => {
    if (!progress || progress.status === 'not_started') return 'from-gray-500/20 to-gray-500/5'
    if (progress.status === 'watching') return 'from-blue-500/20 to-blue-500/5'
    return 'from-green-500/20 to-green-500/5'
  }

  const getStatusLabel = () => {
    if (!progress || progress.status === 'not_started') return null
    if (progress.status === 'watching') return `${Math.round(progressPercentage)}% watched`
    return 'Completed'
  }

  return (
    <motion.div
      className="group cursor-pointer"
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect?.(video)}
    >
      <div className="relative rounded-lg overflow-hidden bg-card border border-primary/20 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all h-72 bg-gradient-to-br from-primary/20 to-background flex flex-col justify-between">
        {/* Thumbnail Background */}
        <div className="absolute inset-0 opacity-30">
          <Image
            src={thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg"
            }}
          />
        </div>

        {/* Status Badge - Top Left */}
        {!loading && progress && progress.status !== 'not_started' && (
          <motion.div 
            className={`relative z-10 m-4 bg-gradient-to-r ${getStatusColor()} border ${progress.status === 'completed' ? 'border-green-500/50' : 'border-blue-500/50'} rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1 w-fit`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {progress.status === 'completed' ? (
              <>
                <CheckCircle2 size={12} className="text-green-400" />
                <span className="text-green-300">Completed</span>
              </>
            ) : (
              <>
                <RotateCcw size={12} className="text-blue-400" />
                <span className="text-blue-300">{getStatusLabel()}</span>
              </>
            )}
          </motion.div>
        )}

        {/* Participants Badge - Top Right */}
        <motion.div className="relative z-10 m-4 bg-primary/20 border border-primary/30 rounded-full px-3 py-1 text-xs text-primary font-semibold flex items-center gap-1 w-fit ml-auto">
          <Users size={12} />
          <span className="text-white">{participantCount.toLocaleString()}</span>
        </motion.div>

        {/* Overlay with Play Button */}
        <motion.div
          className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        >
          <motion.button
            className="bg-primary text-black rounded-full p-4 hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Play ${video.title}`}
          >
            <Play size={24} fill="currentColor" />
          </motion.button>
        </motion.div>

        {/* Progress Bar */}
        {!loading && progress && progress.status === 'watching' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40 z-10">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        )}

        {/* Completed Indicator - Bottom Bar */}
        {!loading && progress && progress.status === 'completed' && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500/80 z-10" />
        )}

        {/* Info - Bottom */}
        <div className="relative z-10 mt-auto space-y-2 p-4 bg-gradient-to-t from-black to-transparent">
          <h3 className="text-sm font-bold text-white line-clamp-2">{video.title}</h3>
          <p className="text-xs text-primary/80 line-clamp-1">{video.description || video.subtitle}</p>
          {video.duration && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock size={12} />
              <span>{video.duration}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
