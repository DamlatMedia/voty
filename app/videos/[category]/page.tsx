"use client"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import VideoCard from "@/components/dashboard/video-card"

// Mock videos for different categories
const mockVideosByCategory: Record<string, any[]> = {
  "moral-stories": [
    {
      id: 1,
      title: "Integrity Story #1",
      description: "Explore ethical dilemmas in Nigerian context",
      thumb: "/nigerian-integrity-story.jpg",
      participants: 1247,
      duration: "12:34",
    },
    {
      id: 2,
      title: "Honesty Wins #2",
      description: "A tale of truthfulness overcoming adversity",
      thumb: "/nigerian-honesty-story.jpg",
      participants: 956,
      duration: "14:22",
    },
    {
      id: 3,
      title: "Kindness Prevails #3",
      description: "Compassion changes lives in unexpected ways",
      thumb: "/nigerian-kindness-story.jpg",
      participants: 1823,
      duration: "11:45",
    },
    {
      id: 4,
      title: "Respect & Humility #4",
      description: "Learning the value of respect in relationships",
      thumb: "/nigerian-respect-story.jpg",
      participants: 743,
      duration: "13:12",
    },
    {
      id: 5,
      title: "Hard Work Story #5",
      description: "How persistence leads to success",
      thumb: "/nigerian-hard-work-story.jpg",
      participants: 2134,
      duration: "15:33",
    },
    {
      id: 6,
      title: "Courage & Fear #6",
      description: "Facing challenges with bravery",
      thumb: "/nigerian-courage-story.jpg",
      participants: 1567,
      duration: "12:09",
    },
    {
      id: 7,
      title: "Unity in Diversity #7",
      description: "Finding strength in togetherness",
      thumb: "/nigerian-unity-story.jpg",
      participants: 1891,
      duration: "13:45",
    },
    {
      id: 8,
      title: "Forgiveness Journey #8",
      description: "The healing power of letting go",
      thumb: "/nigerian-forgiveness-story.jpg",
      participants: 1102,
      duration: "10:23",
    },
    {
      id: 9,
      title: "Justice Matters #9",
      description: "Standing up for what is right",
      thumb: "/nigerian-justice-story.jpg",
      participants: 1456,
      duration: "14:17",
    },
    {
      id: 10,
      title: "Hope & Resilience #10",
      description: "Never giving up on your dreams",
      thumb: "/nigerian-hope-resilience-story.jpg",
      participants: 2045,
      duration: "13:28",
    },
  ],
  trending: [
    {
      id: 11,
      title: "Viral Youth Movement #1",
      description: "The latest trending content shaking Nigeria",
      thumb: "/nigerian-viral-trend.jpg",
      participants: 5432,
      duration: "8:45",
    },
    {
      id: 12,
      title: "Generation Z Voice #2",
      description: "Young voices speaking out",
      thumb: "/generation-z-nigeria.jpg",
      participants: 4321,
      duration: "9:12",
    },
    {
      id: 13,
      title: "Trending Challenge #3",
      description: "Join the movement sweeping the nation",
      thumb: "/nigerian-trending-challenge.jpg",
      participants: 6234,
      duration: "7:33",
    },
    {
      id: 14,
      title: "Hot Topic #4",
      description: "What everyone is talking about",
      thumb: "/nigerian-hot-topic.jpg",
      participants: 3892,
      duration: "10:15",
    },
    {
      id: 15,
      title: "This Week's Buzz #5",
      description: "The hottest content this week",
      thumb: "/nigerian-this-week-buzz.jpg",
      participants: 4567,
      duration: "8:56",
    },
    {
      id: 16,
      title: "Viral Sensation #6",
      description: "Breaking the internet in Nigeria",
      thumb: "/placeholder.svg?height=420&width=280",
      participants: 7123,
      duration: "6:45",
    },
    {
      id: 17,
      title: "Social Media Gold #7",
      description: "Dominating all platforms",
      thumb: "/placeholder.svg?height=420&width=280",
      participants: 5678,
      duration: "9:34",
    },
    {
      id: 18,
      title: "Viral Moment #8",
      description: "Unforgettable content",
      thumb: "/placeholder.svg?height=420&width=280",
      participants: 6789,
      duration: "7:12",
    },
    {
      id: 19,
      title: "Trending Now #9",
      description: "Peak entertainment",
      thumb: "/placeholder.svg?height=420&width=280",
      participants: 5234,
      duration: "8:22",
    },
    {
      id: 20,
      title: "Must Watch #10",
      description: "Essential viewing material",
      thumb: "/placeholder.svg?height=420&width=280",
      participants: 4891,
      duration: "9:45",
    },
  ],
  educational: [
    {
      id: 21,
      title: "Life Skills 101 #1",
      description: "Essential skills for young adults",
      thumb: "/placeholder.svg?height=420&width=280",
      participants: 2134,
      duration: "16:45",
    },
    {
      id: 22,
      title: "Leadership Basics #2",
      description: "Becoming an effective leader",
      thumb: "/placeholder.svg?height=420&width=280",
      participants: 1876,
      duration: "14:22",
    },
    {
      id: 23,
      title: "Financial Literacy #3",
      description: "Managing money wisely",
      thumb: "/placeholder.svg?height=420&width=280",
      participants: 2456,
      duration: "17:33",
    },
    {
      id: 24,
      title: "Digital Skills #4",
      description: "Mastering technology for the future",
      thumb: "/placeholder.svg?height=420&width=280",
      participants: 1923,
      duration: "15:12",
    },
    {
      id: 25,
      title: "Communication Power #5",
      description: "Effective communication techniques",
      thumb: "/placeholder.svg?height=420&width=280",
      participants: 2789,
      duration: "13:45",
    },
    {
      id: 26,
      title: "Time Management #6",
      description: "Productivity hacks for success",
      thumb: "/placeholder.svg?height=420&width=280",
      participants: 2145,
      duration: "12:34",
    },
    {
      id: 27,
      title: "Decision Making #7",
      description: "Making smart choices in life",
      thumb: "/placeholder.svg?height=420&width=280",
      participants: 1834,
      duration: "14:56",
    },
    {
      id: 28,
      title: "Entrepreneurship 101 #8",
      description: "Starting your own business",
      thumb: "/placeholder.svg?height=420&width=280",
      participants: 2567,
      duration: "18:22",
    },
    {
      id: 29,
      title: "Critical Thinking #9",
      description: "Develop analytical skills",
      thumb: "/placeholder.svg?height=420&width=280",
      participants: 1645,
      duration: "13:18",
    },
    {
      id: 30,
      title: "Self Development #10",
      description: "Unlocking your potential",
      thumb: "/placeholder.svg?height=420&width=280",
      participants: 2912,
      duration: "15:44",
    },
  ],
}

export default function CategoryVideosPage() {
  const params = useParams()
  const router = useRouter()
  const category = params.category as string
  const videos = mockVideosByCategory[category] || mockVideosByCategory["moral-stories"]

  const categoryTitles: Record<string, string> = {
    "moral-stories": "Moral Stories",
    trending: "Trending Videos",
    educational: "Educational Content",
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-4"
        >
          <button onClick={() => router.back()} className="p-2 hover:bg-primary/10 rounded-lg text-primary transition">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{categoryTitles[category] || "Videos"}</h1>
            <p className="text-muted-foreground">Browse all videos in this category</p>
          </div>
        </motion.div>

        {/* Videos Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          {videos.map((video, idx) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <VideoCard video={video} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
