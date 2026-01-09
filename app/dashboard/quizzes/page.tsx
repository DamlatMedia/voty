"use client"

import { motion } from "framer-motion"
import { useState } from "react"

export default function QuizzesPage() {
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null)

  const quizzes = [
    { id: "1", title: "Integrity & Ethics Quiz", questions: 10, difficulty: "Beginner" },
    { id: "2", title: "Career Readiness Assessment", questions: 15, difficulty: "Intermediate" },
    { id: "3", title: "Nigerian History Challenge", questions: 20, difficulty: "Advanced" },
    { id: "4", title: "Financial Literacy 101", questions: 12, difficulty: "Beginner" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl md:text-5xl font-bold text-gold mb-4">Quizzes & Challenges</h1>
        <p className="text-muted-foreground mb-8">Test your knowledge and earn rewards</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {quizzes.map((quiz) => (
          <motion.div
            key={quiz.id}
            className="bg-card border border-primary/30 rounded-xl p-6 hover:border-gold transition glow-gold-hover"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-xl font-bold text-white mb-2">{quiz.title}</h3>
            <p className="text-sm text-primary mb-4">
              {quiz.questions} questions • {quiz.difficulty}
            </p>
            <motion.button
              className="w-full bg-gold text-black py-2 rounded-lg font-semibold hover:bg-gold/90 transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Quiz
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
