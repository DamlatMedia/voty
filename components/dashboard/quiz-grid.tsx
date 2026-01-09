"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import QuizCard from "./quiz-card"
import QuizModal from "./quiz-modal"

interface Quiz {
  id: string
  title: string
  description: string
  thumbnail: string
  participantCount: number
  difficulty: "Easy" | "Medium" | "Hard"
}

export default function QuizGrid() {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)

  const quizzes: Quiz[] = [
    {
      id: "q1",
      title: "Nigerian Heroes Trivia",
      description: "Test your knowledge about African history",
      thumbnail: "/nigerian-history-quiz.jpg",
      participantCount: 1847,
      difficulty: "Medium",
    },
    {
      id: "q2",
      title: "Youth Values Quiz",
      description: "Explore core values of empowerment",
      thumbnail: "/youth-values-quiz.jpg",
      participantCount: 2534,
      difficulty: "Easy",
    },
    {
      id: "q3",
      title: "Future Leaders Challenge",
      description: "Are you ready for leadership?",
      thumbnail: "/leadership-challenge-quiz.jpg",
      participantCount: 892,
      difficulty: "Hard",
    },
    {
      id: "q4",
      title: "Ethics in Practice",
      description: "Apply ethics to real scenarios",
      thumbnail: "/ethics-quiz.jpg",
      participantCount: 1567,
      difficulty: "Medium",
    },
    {
      id: "q5",
      title: "Community Impact Quiz",
      description: "Understand social responsibility",
      thumbnail: "/community-quiz.jpg",
      participantCount: 2103,
      difficulty: "Easy",
    },
    {
      id: "q6",
      title: "Career Readiness Test",
      description: "Assess your career preparedness",
      thumbnail: "/career-quiz.jpg",
      participantCount: 1432,
      difficulty: "Hard",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">Live Quizzes</h2>
      </motion.div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {quizzes.map((quiz) => (
          <motion.div key={quiz.id} variants={itemVariants}>
            <QuizCard quiz={quiz} onSelect={setSelectedQuiz} />
          </motion.div>
        ))}
      </motion.div>

      {selectedQuiz && <QuizModal quiz={selectedQuiz} isOpen={!!selectedQuiz} onClose={() => setSelectedQuiz(null)} />}
    </>
  )
}
