"use client"
import { motion } from "framer-motion"
import { Play, Users, Zap } from "lucide-react"

interface QuizCardProps {
  quiz: {
    id: number
    title: string
    description: string
    difficulty?: "Easy" | "Medium" | "Hard"
    participantCount: number
  }
  onSelect?: (quiz: any) => void
}

export default function QuizCard({ quiz, onSelect }: QuizCardProps) {
  const participants = quiz.participantCount ?? 0
  const difficultyColor: Record<string, string> = {
    Easy: "text-green-400",
    Medium: "text-yellow-400",
    Hard: "text-red-400",
  }

  const difficulty = quiz.difficulty || "Medium"

  return (
    <motion.div
      className="group cursor-pointer"
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ duration: 0.3 }}
      onClick={() => onSelect?.(quiz)}
    >
      <div className="relative rounded-lg overflow-hidden bg-card border border-primary/20 group-hover:border-primary/50 group-hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all h-72 bg-gradient-to-br from-primary/20 to-background flex flex-col justify-between p-4">
        <div className="flex items-start justify-between">
          <motion.div className={`flex items-center gap-1 text-xs font-bold ${difficultyColor[difficulty]}`}>
            <Zap size={12} />
            {difficulty}
          </motion.div>

          <motion.div className="bg-primary/20 border border-primary/30 rounded-full px-2 py-1 text-xs text-primary font-semibold flex items-center gap-1">
            <Users size={12} />
            <span className="text-white">{participants.toLocaleString()}</span>
          </motion.div>
        </div>

        {/* Overlay */}
        <motion.div
          className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        >
          <motion.button
            className="bg-primary text-black rounded-full p-4 hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Start ${quiz.title}`}
          >
            <Play size={24} fill="currentColor" />
          </motion.button>
        </motion.div>

        {/* Info - Bottom */}
        <div className="mt-auto">
          <h3 className="text-sm font-bold text-white line-clamp-2">{quiz.title}</h3>
          <p className="text-xs text-primary mt-1 line-clamp-1">{quiz.description}</p>
        </div>
      </div>
    </motion.div>
  )
}
