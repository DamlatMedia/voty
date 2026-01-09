"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Confetti from "react-confetti"
import { useWindowSize } from "@/hooks/use-window-size"

export default function VotingQuiz() {
  const [activeTab, setActiveTab] = useState<"vote" | "quiz">("vote")
  const [showConfetti, setShowConfetti] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({})
  const { width, height } = useWindowSize()

  const quizQuestions = [
    {
      id: "q1",
      question: "What is the most important quality for youth?",
      options: ["Honesty", "Ambition", "Creativity", "Resilience"],
    },
    {
      id: "q2",
      question: "How do you define success?",
      options: ["Money", "Impact", "Happiness", "All of above"],
    },
  ]

  const handleVote = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  const handleSubmitQuiz = () => {
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  return (
    <div>
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}

      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gold mb-8">Engage with VOTY</h2>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <motion.button
            onClick={() => setActiveTab("vote")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "vote" ? "bg-gold text-black" : "bg-card text-white hover:bg-card/80"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Vote Now
          </motion.button>
          <motion.button
            onClick={() => setActiveTab("quiz")}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === "quiz" ? "bg-gold text-black" : "bg-card text-white hover:bg-card/80"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Take Quiz
          </motion.button>
        </div>

        {/* Content */}
        {activeTab === "vote" && (
          <motion.div
            className="bg-card p-8 rounded-xl border border-primary/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">Vote for Your Favorite Video</h3>
            <div className="space-y-4">
              {["Featured Video 1", "Featured Video 2", "Featured Video 3"].map((video, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-background transition"
                >
                  <input type="radio" name="vote" className="w-4 h-4 accent-gold" />
                  <span className="text-white">{video}</span>
                </label>
              ))}
            </div>
            <motion.button
              onClick={handleVote}
              className="mt-6 w-full bg-gold text-black py-3 rounded-lg font-bold hover:bg-gold/90 transition"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Submit Vote
            </motion.button>
          </motion.div>
        )}

        {activeTab === "quiz" && (
          <motion.div
            className="bg-card p-8 rounded-xl border border-primary/30 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {quizQuestions.map((q) => (
              <div key={q.id}>
                <h3 className="text-lg font-semibold text-white mb-4">{q.question}</h3>
                <div className="space-y-2">
                  {q.options.map((option, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-background transition"
                    >
                      <input
                        type="radio"
                        name={q.id}
                        className="w-4 h-4 accent-gold"
                        onChange={() => setQuizAnswers({ ...quizAnswers, [q.id]: option })}
                      />
                      <span className="text-white">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <motion.button
              onClick={handleSubmitQuiz}
              className="w-full bg-gold text-black py-3 rounded-lg font-bold hover:bg-gold/90 transition"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Submit Answers
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
