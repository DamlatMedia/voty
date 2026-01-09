"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Play } from "lucide-react"
import VideoCard from "./video-card"
import VideoPlayerModal from "./video-player-modal"
import { createClient } from "@/lib/supabase/client"

interface Video {
  id: string
  title: string
  subtitle?: string
  description?: string
  thumbnail: string
  url: string
  duration?: number
  participantCount?: number
  view_count?: number
  category?: string
}

interface DbVideo {
  id: string
  title: string
  description: string
  category: string
  video_url: string
  thumbnail_url: string
  view_count: number
  created_at: string
}

export default function VideosGrid({ onVideoClose }: { onVideoClose?: () => void }) {
  const [videos, setVideos] = useState<Video[]>([])
  const [allVideos, setAllVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [categories, setCategories] = useState<string[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        console.log("🎬 Fetching videos from Supabase...")
        
        // Fetch ALL videos first (ignore status filter to debug)
        const { data, error } = await supabase
          .from("videos")
          .select("*")
          .order("created_at", { ascending: false })

        console.log("📊 Supabase Response:", { 
          data, 
          error,
          count: data?.length 
        })

        if (error) {
          console.error("❌ Error fetching videos:", error)
          setVideos([])
          setLoading(false)
          return
        }

        if (!data) {
          console.warn("⚠️ No data returned from Supabase")
          setVideos([])
          setLoading(false)
          return
        }

        console.log(`✅ Found ${data.length} videos in database`)

        if (data && Array.isArray(data) && data.length > 0) {
          console.log("🎥 Transforming videos:", data)
          const transformedVideos: Video[] = data.map((vid: DbVideo) => {
            console.log(`Converting video: ${vid.title}`)
            return {
              id: vid.id,
              title: vid.title || "Untitled Video",
              subtitle: vid.category || "Educational Content",
              description: vid.description || "",
              thumbnail: vid.thumbnail_url || "/placeholder.svg",
              url: vid.video_url,
              participantCount: vid.view_count || 0,
              category: vid.category,
            }
          })
          console.log("✅ Transformed videos:", transformedVideos)
          setAllVideos(transformedVideos)
          setVideos(transformedVideos)
          
          // Extract unique categories
          const uniqueCategories = Array.from(new Set(transformedVideos.map(v => v.category).filter(Boolean)))
          setCategories(uniqueCategories as string[])
        } else {
          console.log("📭 No videos found in database")
          setVideos([])
          setAllVideos([])
        }

        setLoading(false)
      } catch (error) {
        console.error("💥 Unexpected error fetching videos:", error)
        setVideos([])
        setLoading(false)
      }
    }

    fetchVideos()

    // Subscribe to real-time updates
    const channel = supabase
      .channel("videos_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "videos",
        },
        (payload) => {
          console.log("🔄 Video update received:", payload)
          // Refetch videos when changes occur
          fetchVideos()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (category === "all") {
      setVideos(allVideos)
    } else {
      setVideos(allVideos.filter(v => v.category === category))
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-card rounded-lg h-64 animate-pulse border border-primary/10" />
          ))}
        </div>
      </div>
    )
  }

  if (videos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-card/50 to-background border border-primary/10 rounded-xl"
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
            <Play className="text-primary" size={32} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Videos Yet</h3>
          <p className="text-muted-foreground mb-2">Videos will appear here when the admin uploads them</p>
          <p className="text-xs text-primary/60">Check back soon for new educational content!</p>
        </div>
      </motion.div>
    )
  }

  return (
    <>
      {/* Category Selector */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <label className="block text-sm font-semibold text-white mb-3">
          Select Category
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange("all")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedCategory === "all"
                ? "bg-primary text-black"
                : "bg-primary/20 text-primary hover:bg-primary/30"
            }`}
          >
            All Videos
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-black"
                  : "bg-primary/20 text-primary hover:bg-primary/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {videos.map((video) => (
          <motion.div key={video.id} variants={itemVariants}>
            <VideoCard
              video={{
                id: video.id,
                title: video.title,
                subtitle: video.subtitle,
                participants: video.participantCount,
                duration: `${Math.floor(video.duration / 60)}m`,
              }}
              onSelect={() => setSelectedVideo(video)}
              refreshTrigger={refreshTrigger}
            />
          </motion.div>
        ))}
      </motion.div>

      {selectedVideo && (
        <VideoPlayerModal 
          video={selectedVideo} 
          isOpen={!!selectedVideo} 
          onClose={() => {
            setSelectedVideo(null)
            // Trigger callback to refresh dashboard stats and video cards
            onVideoClose?.()
            // Force video card refresh after a slight delay
            setTimeout(() => setRefreshTrigger(prev => prev + 1), 500)
          }} 
        />
      )}
    </>
  )
}
