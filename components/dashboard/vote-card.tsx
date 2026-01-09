"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BarChart3 } from "lucide-react"

interface VoteCardProps {
  vote: {
    id: number
    title: string
    description: string
    optionA: string
    optionB: string
    votesA: number
    votesB: number
    participants: number
  }
  onVote?: (option: "A" | "B") => void
}

export default function VoteCard({ vote, onVote }: VoteCardProps) {
  const [userVote, setUserVote] = useState<"A" | "B" | null>(null)

  const votesA = vote.votesA ?? 0
  const votesB = vote.votesB ?? 0
  const participants = vote.participants ?? 0

  const totalVotes = votesA + votesB
  const percentA = totalVotes > 0 ? (votesA / totalVotes) * 100 : 0
  const percentB = totalVotes > 0 ? (votesB / totalVotes) * 100 : 0

  const handleVote = (option: "A" | "B") => {
    setUserVote(option)
    onVote?.(option)
  }

  return (
    <motion.div
      className="bg-card border border-primary/20 rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20"
      whileHover={{ scale: 1.02 }}
    >
      <h3 className="text-lg font-bold text-white mb-2">{vote.title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{vote.description}</p>

      <div className="space-y-4">
        {/* Option A */}
        <motion.button
          onClick={() => handleVote("A")}
          className={`w-full p-4 rounded-lg border-2 transition-all ${
            userVote === "A" ? "border-primary bg-primary/10" : "border-primary/20 hover:border-primary/40"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="text-left">
            <p className="text-white font-medium mb-2">{vote.optionA}</p>
            <div className="flex justify-between items-center">
              <div className="w-full bg-background rounded-full h-2 mr-3">
                <motion.div
                  className="bg-primary h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentA}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-primary font-bold text-sm whitespace-nowrap">{Math.round(percentA)}%</span>
            </div>
          </div>
        </motion.button>

        {/* Option B */}
        <motion.button
          onClick={() => handleVote("B")}
          className={`w-full p-4 rounded-lg border-2 transition-all ${
            userVote === "B" ? "border-primary bg-primary/10" : "border-primary/20 hover:border-primary/40"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="text-left">
            <p className="text-white font-medium mb-2">{vote.optionB}</p>
            <div className="flex justify-between items-center">
              <div className="w-full bg-background rounded-full h-2 mr-3">
                <motion.div
                  className="bg-primary/50 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentB}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-primary font-bold text-sm whitespace-nowrap">{Math.round(percentB)}%</span>
            </div>
          </div>
        </motion.button>
      </div>

      <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
        <BarChart3 size={14} />
        <span>{participants.toLocaleString()} participants</span>
      </div>
    </motion.div>
  )
}
