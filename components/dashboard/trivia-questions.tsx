"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, CheckCircle2, XCircle, SkipForward, RotateCcw, X } from "lucide-react"

interface TriviaQuestion {
  id: string
  question: string
  options: string[]
  correct_answer: string
  category: string
  difficulty: string
}

interface UserAnswer {
  questionIndex: number
  selectedAnswer: string
  isCorrect: boolean
}

interface TriviaQuestionsProps {
  category?: string
}

export default function TriviaQuestions({ category = "all" }: TriviaQuestionsProps) {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([])
  const [allQuestions, setAllQuestions] = useState<TriviaQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    const fetchTrivia = async () => {
      try {
        setLoading(true)
        // Fetch all questions
        const response = await fetch("/api/trivia")
        const result = await response.json()

        console.log("Trivia response:", result)

        if (result.error) {
          setError(result.error)
        } else {
          const data = result.data || []
          setAllQuestions(data)
          
          // Extract unique categories
          const uniqueCategories = Array.from(new Set(data.map((q: TriviaQuestion) => q.category)))
          setCategories(uniqueCategories as string[])
          
          // Set initial questions based on default category
          if (category && category !== "all") {
            setSelectedCategory(category)
            const filtered = data.filter((q: TriviaQuestion) => q.category === category)
            setQuestions(filtered)
          } else {
            setQuestions(data)
          }
          
          if ((!data || data.length === 0) && !result.error) {
            setError("No trivia questions found")
          }
        }
      } catch (err) {
        console.error("Fetch error:", err)
        setError(err instanceof Error ? err.message : "Failed to load trivia questions")
      } finally {
        setLoading(false)
      }
    }

    fetchTrivia()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full"
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="bg-primary/10 border border-primary/30 rounded-lg p-8 text-center">
        <BookOpen className="mx-auto mb-4 text-primary" size={40} />
        <p className="text-muted-foreground">No trivia questions available yet</p>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  
  // Convert correctAnswer from "option1" format to actual text
  let correctAnswerText = currentQuestion.correct_answer
  const optionMatch = currentQuestion.correct_answer.match(/option(\d)/)
  if (optionMatch) {
    const optionIndex = parseInt(optionMatch[1]) - 1
    if (optionIndex >= 0 && optionIndex < currentQuestion.options.length) {
      correctAnswerText = currentQuestion.options[optionIndex]
    }
  }
  
  const isCorrect = selectedAnswer?.trim().toLowerCase() === correctAnswerText.trim().toLowerCase()
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const handleSelectAnswer = (option: string) => {
    if (!answered) {
      setSelectedAnswer(option)
      setAnswered(true)
      const normalizedOption = option.trim().toLowerCase()
      const normalizedCorrect = correctAnswerText.trim().toLowerCase()
      const isCorrect = normalizedOption === normalizedCorrect
      
      // Track the user's answer
      setUserAnswers([...userAnswers, {
        questionIndex: currentQuestionIndex,
        selectedAnswer: option,
        isCorrect: isCorrect
      }])
      
      if (isCorrect) {
        setScore(score + 1)
      }
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setAnswered(false)
    } else {
      // Quiz complete
      setShowResults(true)
    }
  }

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setAnswered(false)
    setScore(0)
    setShowResults(false)
    setUserAnswers([])
  }

  const handleCategoryChange = (newCategory: string) => {
    setSelectedCategory(newCategory)
    let filtered = allQuestions
    if (newCategory !== "all") {
      filtered = allQuestions.filter(q => q.category === newCategory)
    }
    setQuestions(filtered)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setAnswered(false)
    setScore(0)
    setShowResults(false)
    setUserAnswers([])
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
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
            All Categories
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

      {/* Progress Bar */}
      <motion.div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </span>
          <span className="text-sm font-semibold text-primary">
            Score: {score}/{questions.length}
          </span>
        </div>
        <div className="w-full bg-black/50 rounded-full h-2 border border-primary/30">
          <motion.div
            className="bg-gradient-to-r from-primary to-primary/50 h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Question Card */}
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-card border border-primary/30 rounded-xl p-8 mb-6 backdrop-blur-sm"
      >
        {/* Category & Difficulty */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-primary/10">
          <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-sm rounded-full">
            {currentQuestion.category}
          </span>
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full ${
              currentQuestion.difficulty === "easy"
                ? "bg-green-500/20 text-green-400"
                : currentQuestion.difficulty === "medium"
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-red-500/20 text-red-400"
            }`}
          >
            {currentQuestion.difficulty}
          </span>
        </div>

        {/* Question */}
        <h2 className="text-2xl font-bold text-white mb-8">{currentQuestion.question}</h2>

        {/* Options */}
        <div className="space-y-4 mb-8">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option
            let optionClassName =
              "bg-primary/10 border-primary/30 text-white hover:bg-primary/20"

            if (answered && isSelected) {
              optionClassName = "bg-primary/30 border-primary/50 text-white"
            }

            return (
              <motion.button
                key={index}
                onClick={() => handleSelectAnswer(option)}
                disabled={answered}
                whileHover={!answered ? { scale: 1.02 } : {}}
                whileTap={!answered ? { scale: 0.98 } : {}}
                className={`w-full p-4 rounded-lg border-2 text-left font-semibold transition-all flex items-center justify-between ${optionClassName} ${
                  answered ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <span>{option}</span>
              </motion.button>
            )
          })}
        </div>

        {/* Next Button */}
        {answered && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={handleNext}
            className="w-full bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2"
          >
            {currentQuestionIndex < questions.length - 1 ? (
              <>
                Next Question <SkipForward size={18} />
              </>
            ) : (
              "See Results"
            )}
          </motion.button>
        )}
      </motion.div>

      {/* Results Modal */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowResults(false)}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-primary/30 rounded-2xl w-full max-h-[90vh] overflow-y-auto backdrop-blur-sm"
            >
              {/* Header with Close Button */}
              <div className="sticky top-0 bg-card border-b border-primary/20 p-6 flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-bold text-white">Quiz Results</h2>
                <button
                  onClick={() => setShowResults(false)}
                  className="p-2 hover:bg-primary/20 rounded-lg transition"
                >
                  <X size={24} className="text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Score Summary */}
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="flex justify-center mb-4"
                  >
                    <div className="relative">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                        <span className="text-3xl sm:text-4xl font-bold text-black">
                          {Math.round((score / questions.length) * 100)}%
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Score Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-primary/10 border border-primary/20 rounded-lg p-4 sm:p-6"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-muted-foreground">Correct Answers:</span>
                      <span className="text-lg font-bold text-green-400">{score}/{questions.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base text-muted-foreground">Accuracy:</span>
                      <span className="text-lg font-bold text-primary">
                        {Math.round((score / questions.length) * 100)}%
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Performance Message */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  {score === questions.length ? (
                    <p className="text-green-400 font-semibold text-sm sm:text-base">🎉 Perfect Score! Amazing!</p>
                  ) : score >= questions.length * 0.8 ? (
                    <p className="text-blue-400 font-semibold text-sm sm:text-base">🌟 Great Job! Keep it up!</p>
                  ) : score >= questions.length * 0.6 ? (
                    <p className="text-yellow-400 font-semibold text-sm sm:text-base">👍 Good effort! Practice more!</p>
                  ) : (
                    <p className="text-orange-400 font-semibold text-sm sm:text-base">💪 Keep practicing!</p>
                  )}
                </motion.div>

                {/* Questions Review */}
                <div className="space-y-3">
                  <h3 className="text-white font-semibold text-sm sm:text-base">Review Answers</h3>
                  <div className="max-h-96 overflow-y-auto space-y-3">
                    {questions.map((q, idx) => {
                      const userAnswer = userAnswers.find(a => a.questionIndex === idx)
                      let correctAnswerText = q.correct_answer
                      const optionMatch = q.correct_answer.match(/option(\d)/)
                      if (optionMatch) {
                        const optionIndex = parseInt(optionMatch[1]) - 1
                        if (optionIndex >= 0 && optionIndex < q.options.length) {
                          correctAnswerText = q.options[optionIndex]
                        }
                      }
                      const isCorrect = userAnswer?.isCorrect
                      
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + idx * 0.05 }}
                          className={`p-3 sm:p-4 rounded-lg border-2 ${
                            isCorrect
                              ? "bg-green-500/10 border-green-500/30"
                              : "bg-red-500/10 border-red-500/30"
                          }`}
                        >
                          <div className="flex gap-2 mb-2">
                            {isCorrect ? (
                              <CheckCircle2 className="text-green-400 flex-shrink-0 w-5 h-5" />
                            ) : (
                              <XCircle className="text-red-400 flex-shrink-0 w-5 h-5" />
                            )}
                            <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                              Q{idx + 1}
                            </span>
                          </div>
                          <p className="text-white font-semibold text-sm mb-2">{q.question}</p>
                          <div className="space-y-2 text-xs sm:text-sm">
                            <div>
                              <p className="text-muted-foreground">Your answer:</p>
                              <p className={`font-semibold ${isCorrect ? "text-green-400" : "text-red-400"}`}>
                                {userAnswer?.selectedAnswer || "Not answered"}
                              </p>
                            </div>
                            {!isCorrect && (
                              <div>
                                <p className="text-muted-foreground">Correct answer:</p>
                                <p className="font-semibold text-green-400">{correctAnswerText}</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>
                </div>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex gap-3 pt-4"
                >
                  <button
                    onClick={handleRetakeQuiz}
                    className="flex-1 bg-primary text-black font-bold py-3 rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={18} />
                    Retake Quiz
                  </button>
                  <button
                    onClick={() => setShowResults(false)}
                    className="flex-1 bg-primary/20 text-primary font-bold py-3 rounded-lg hover:bg-primary/30 transition"
                  >
                    Close
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>    </div>
  )
}