"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Confetti from "react-confetti"
import { useWindowSize } from "@/hooks/use-window-size"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function VotingSection() {
  const [selectedVote, setSelectedVote] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { width, height } = useWindowSize()

  const votingOptions = [
    { id: "1", title: "Best Moral Story", votes: 2456 },
    { id: "2", title: "Best Youth Initiative", votes: 1892 },
    { id: "3", title: "Most Inspiring Content", votes: 3104 },
  ]

  const chartData = votingOptions.map((opt) => ({
    name: opt.title.split(" ").slice(1).join(" "),
    votes: opt.votes ?? 0,
  }))

  const handleVote = () => {
    if (selectedVote && !submitted) {
      setShowConfetti(true)
      setSubmitted(true)
      setTimeout(() => setShowConfetti(false), 3000)
      setTimeout(() => {
        setSelectedVote(null)
        setSubmitted(false)
      }, 2000)
    }
  }

  return (
    <div>
      {showConfetti && <Confetti width={width || 0} height={height || 0} recycle={false} numberOfPieces={150} />}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Vote Now</h2>
      </motion.div>

      <motion.div
        className="bg-card p-8 rounded-xl border border-primary/20 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {!submitted ? (
          <>
            <p className="text-muted-foreground">Select your favorite and make your voice heard</p>

            {/* Voting Options */}
            <div className="space-y-3">
              {votingOptions.map((option) => (
                <motion.label
                  key={option.id}
                  className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer border-2 transition ${
                    selectedVote === option.id
                      ? "border-primary bg-primary/10"
                      : "border-primary/20 hover:border-primary/40 bg-background/50"
                  }`}
                  whileHover={{ scale: 1.01 }}
                >
                  <input
                    type="radio"
                    name="vote"
                    value={option.id}
                    checked={selectedVote === option.id}
                    onChange={(e) => setSelectedVote(e.target.value)}
                    className="w-5 h-5 accent-primary"
                  />
                  <div className="flex-1">
                    <p className="text-white font-semibold">{option.title}</p>
                    <p className="text-sm text-muted-foreground">{(option.votes ?? 0).toLocaleString()} votes</p>
                  </div>
                </motion.label>
              ))}
            </div>

            {/* Vote Button */}
            <motion.button
              onClick={handleVote}
              disabled={!selectedVote}
              className="w-full bg-primary text-black py-3 rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition glow-gold-hover"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Submit Vote
            </motion.button>
          </>
        ) : (
          <>
            {/* Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6 }} className="text-5xl">
                ✓
              </motion.div>
              <div>
                <p className="text-2xl font-bold text-primary mb-1">Vote Submitted!</p>
                <p className="text-white">Thank you for participating</p>
              </div>
            </motion.div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.1)" />
                <XAxis dataKey="name" stroke="#ffffff" style={{ fontSize: "12px" }} />
                <YAxis stroke="#ffffff" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(212,175,55,0.3)",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "white" }}
                />
                <Bar dataKey="votes" fill="#D4AF37" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>

            <p className="text-center text-xs text-muted-foreground">Redirecting...</p>
          </>
        )}
      </motion.div>
    </div>
  )
}
