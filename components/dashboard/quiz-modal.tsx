"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronRight } from "lucide-react"
import Confetti from "react-confetti"
import { useWindowSize } from "@/hooks/use-window-size"
import { useToast } from "@/hooks/use-toast"

interface Quiz {
  id: string
  title: string
  description: string
  thumbnail: string
  participantCount: number
  difficulty: "Easy" | "Medium" | "Hard"
}

interface QuizModalProps {
  quiz: Quiz
  isOpen: boolean
  onClose: () => void
}

interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: number
}

export default function QuizModal({ quiz, isOpen, onClose }: QuizModalProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [showResults, setShowResults] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const { width, height } = useWindowSize()
  const { toast } = useToast()

  // Mock quiz questions for demo
  const questions: Question[] = [
    {
      id: 1,
      text: "What is the capital of Nigeria?",
      options: ["Lagos", "Abuja", "Kano", "Port Harcourt"],
      correctAnswer: 1,
    },
    {
      id: 2,
      text: "Which value is most important for youth empowerment?",
      options: ["Wealth", "Education", "Entertainment", "None"],
      correctAnswer: 1,
    },
    {
      id: 3,
      text: "How many states does Nigeria have?",
      options: ["34", "35", "36", "37"],
      correctAnswer: 2,
    },
  ]

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const handleSelectAnswer = (optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion]: optionIndex,
    })
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmitQuiz()
    }
  }

  const handleSubmitQuiz = () => {
    // Calculate score
    let score = 0
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        score++
      }
    })

    setShowConfetti(true)
    toast({
      title: "Quiz Complete!",
      description: `You scored ${score}/${questions.length}!`,
    })
    setShowResults(true)

    setTimeout(() => setShowConfetti(false), 3000)
  }

  const currentQ = questions[currentQuestion]
  const score = Object.keys(selectedAnswers).reduce((acc, idx) => {
    if (selectedAnswers[Number(idx)] === questions[Number(idx)].correctAnswer) {
      return acc + 1
    }
    return acc
  }, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {showConfetti && <Confetti width={width} height={height} recycle={false} />}

          <motion.div
            className="w-full max-w-2xl bg-card rounded-xl overflow-hidden border border-primary/20"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/20 to-transparent p-6 flex justify-between items-center border-b border-primary/30">
              <div>
                <h3 className="text-2xl font-bold text-white">{quiz.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{quiz.description}</p>
              </div>
              <button
                onClick={onClose}
                className="text-primary hover:text-primary/80 transition p-2"
                aria-label="Close quiz"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {!showResults ? (
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Question {currentQuestion + 1} of {questions.length}
                      </span>
                      <span className="text-primary font-semibold">
                        {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2">
                      <motion.div
                        className="bg-primary h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <div>
                    <h4 className="text-xl font-bold text-white mb-6">{currentQ.text}</h4>

                    {/* Options */}
                    <div className="space-y-3">
                      {currentQ.options.map((option, idx) => (
                        <motion.button
                          key={idx}
                          onClick={() => handleSelectAnswer(idx)}
                          className={`w-full text-left p-4 rounded-lg border-2 transition ${
                            selectedAnswers[currentQuestion] === idx
                              ? "border-primary bg-primary/10"
                              : "border-primary/20 hover:border-primary/40 bg-background/50"
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="text-white font-medium">{option}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Next Button */}
                  <motion.button
                    onClick={handleNextQuestion}
                    disabled={selectedAnswers[currentQuestion] === undefined}
                    className="w-full bg-primary text-black py-3 rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                    <ChevronRight size={20} />
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center space-y-6"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
                    className="text-6xl"
                  >
                    🎉
                  </motion.div>

                  <div>
                    <h4 className="text-3xl font-bold text-primary mb-2">Quiz Complete!</h4>
                    <p className="text-lg text-white mb-2">
                      You scored{" "}
                      <span className="font-bold text-primary">
                        {score}/{questions.length}
                      </span>
                    </p>
                    <p className="text-muted-foreground">
                      {score === questions.length
                        ? "Perfect score! You're a champion!"
                        : score >= Math.ceil(questions.length * 0.7)
                          ? "Great job! You did well!"
                          : "Good effort! Try again to improve your score."}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4">
                    <motion.button
                      onClick={() => {
                        setCurrentQuestion(0)
                        setSelectedAnswers({})
                        setShowResults(false)
                      }}
                      className="w-full bg-primary text-black py-3 rounded-lg font-bold hover:bg-primary/90 transition"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Retake Quiz
                    </motion.button>
                    <motion.button
                      onClick={onClose}
                      className="w-full bg-background text-white border border-primary/20 py-3 rounded-lg font-bold hover:border-primary/40 transition"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Close
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
