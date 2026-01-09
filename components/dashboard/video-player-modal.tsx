"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Volume2, VolumeX, Maximize, Play, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Video {
  id: string
  title: string
  subtitle?: string
  description?: string
  thumbnail: string
  url: string
  duration?: number
}

interface TriviaQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation?: string
}

interface VideoPlayerModalProps {
  video: Video
  isOpen: boolean
  onClose: () => void
}

export default function VideoPlayerModal({ video, isOpen, onClose }: VideoPlayerModalProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [isVideoComplete, setIsVideoComplete] = useState(false)
  const [showTrivia, setShowTrivia] = useState(false)
  const [triviaQuestions, setTriviaQuestions] = useState<TriviaQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const progressUpdateInterval = useRef<NodeJS.Timeout | null>(null)
  const supabase = createClient()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Save video progress to database
  const saveProgress = async (currentSeconds: number, duration: number) => {
    try {
      // Get current user from Supabase auth, fall back to localStorage `votyUser`
      let user: any = null
      try {
        const authRes = await supabase.auth.getUser()
        user = authRes?.data?.user ?? null
      } catch (e) {
        user = null
      }

      if (!user) {
        try {
          const stored = typeof window !== 'undefined' ? localStorage.getItem('votyUser') : null
          if (stored) user = JSON.parse(stored)
        } catch (e) {
          user = null
        }
      }

      if (!user) {
        console.error("❌ User not authenticated - cannot save progress")
        return
      }

      const progressPercentage = duration > 0 ? (currentSeconds / duration) * 100 : 0
      const status = progressPercentage >= 90 ? "completed" : "watching"

      console.log("[PROGRESS SAVE] Attempting to save:", {
        userId: user.id,
        videoId: video.id,
        progressSeconds: currentSeconds,
        duration,
        percentage: Math.round(progressPercentage),
        status,
      })

      // Ensure video_id is a string (Supabase will handle UUID conversion)
      const videoId = String(video.id)

      // Use upsert - Supabase will handle the UNIQUE constraint automatically
      const { data, error } = await supabase
        .from('video_progress')
        .upsert(
          {
            user_id: user.id,
            video_id: videoId,
            progress_seconds: currentSeconds,
            total_duration_seconds: duration,
            status: status,
            last_watched_at: new Date().toISOString(),
          }
        )
        .select()

      if (error) {
        console.error("❌ [PROGRESS SAVE] Upsert failed:", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        })
        console.error("[PROGRESS SAVE] Full error:", error)
      } else {
        console.log("✅ [PROGRESS SAVE] Success! Saved:", data)
      }
    } catch (error) {
      console.error("❌ Exception saving progress:", error)
    }
  }

  useEffect(() => {
    if (isVideoComplete && !showTrivia) {
      // Fetch trivia questions linked to this video
      fetchVideoTrivia()
      setShowTrivia(true)
    }
  }, [isVideoComplete, showTrivia])

  const fetchVideoTrivia = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/video-trivia?videoId=${video.id}`)
      const data = await response.json()

      if (data.success && data.questions && data.questions.length > 0) {
        // Transform questions to match TriviaQuestion interface
        const formattedQuestions = data.questions.map((q: any) => ({
          id: q.id,
          question: q.question,
          options: q.options,
          correctAnswer: parseCorrectAnswer(q.correct_answer, q.options),
          explanation: q.explanation || "",
        }))
        setTriviaQuestions(formattedQuestions)
      } else {
        setTriviaQuestions([])
      }
    } catch (error) {
      console.error("Error fetching trivia questions:", error)
      setTriviaQuestions([])
    } finally {
      setIsLoading(false)
    }
  }

  const parseCorrectAnswer = (correctAnswer: string, options: string[]): number => {
    // correctAnswer format is "option1", "option2", etc.
    if (correctAnswer.startsWith("option")) {
      const optionIndex = parseInt(correctAnswer.replace("option", "")) - 1
      return Math.max(0, Math.min(optionIndex, options.length - 1))
    }
    // Fallback: try to find by text
    return options.findIndex(opt => opt.toLowerCase() === correctAnswer.toLowerCase()) || 0
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showResults) {
      const newAnswers = [...selectedAnswers]
      newAnswers[currentQuestionIndex] = answerIndex
      setSelectedAnswers(newAnswers)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < triviaQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const calculateScore = () => {
    let correct = 0
    triviaQuestions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++
      }
    })
    return Math.round((correct / triviaQuestions.length) * 100)
  }

  const currentQuestion = triviaQuestions[currentQuestionIndex]
  const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-5xl max-h-[90vh] bg-gradient-to-b from-card to-black/80 rounded-2xl overflow-hidden border border-primary/20 shadow-2xl"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/20 to-transparent p-6 border-b border-primary/20 flex justify-between items-center">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-1">{video.title}</h3>
                <p className="text-sm text-primary/80">{video.subtitle || "Educational Content"}</p>
              </div>
              <motion.button
                onClick={onClose}
                className="text-primary/60 hover:text-primary transition p-2 rounded-lg hover:bg-primary/10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Close player"
              >
                <X size={28} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
              {!showTrivia || !isVideoComplete || triviaQuestions.length === 0 ? (
                <>
                  {/* Video Player */}
                  <div className="relative w-full bg-black aspect-video overflow-hidden">
                    {videoError ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                        <AlertCircle className="text-red-400" size={48} />
                        <div className="text-center">
                          <p className="text-red-400 font-semibold mb-2">Failed to load video</p>
                          <p className="text-red-300 text-sm">{videoError}</p>
                        </div>
                      </div>
                    ) : video.url ? (
                      <video
                        ref={videoRef}
                        src={video.url}
                        controls
                        autoPlay
                        className="w-full h-full"
                        onLoadedMetadata={() => {
                          console.log("Video loaded:", video.url)
                          setVideoError(null)
                        }}
                        onEnded={() => {
                          console.log("Video ended, showing trivia")
                          const duration = videoRef.current?.duration || 0
                          // Save final progress (100%)
                          saveProgress(duration, duration)
                          setIsVideoComplete(true)
                          setVideoProgress(100)
                        }}
                        onTimeUpdate={(e) => {
                          const currentTime = e.currentTarget.currentTime
                          const duration = e.currentTarget.duration
                          if (duration) {
                            setVideoProgress((currentTime / duration) * 100)
                            
                            // Save progress every 10 seconds
                            if (progressUpdateInterval.current) {
                              clearInterval(progressUpdateInterval.current)
                            }
                            
                            progressUpdateInterval.current = setTimeout(() => {
                              saveProgress(currentTime, duration)
                            }, 10000)
                          }
                        }}
                        onError={(e) => {
                          const video = e.currentTarget
                          let errorMsg = "Unknown error loading video"
                          if (video.error) {
                            switch (video.error.code) {
                              case video.error.MEDIA_ERR_ABORTED:
                                errorMsg = "Video loading aborted"
                                break
                              case video.error.MEDIA_ERR_NETWORK:
                                errorMsg = "Network error - check video URL"
                                break
                              case video.error.MEDIA_ERR_DECODE:
                                errorMsg = "Error decoding video - format not supported"
                                break
                              case video.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                                errorMsg = "Video format not supported by browser"
                                break
                              default:
                                errorMsg = video.error.message || "Unknown error loading video"
                            }
                          }
                          console.error("Video error:", errorMsg, video.error, video.src)
                          setVideoError(errorMsg)
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <AlertCircle className="text-red-400 mx-auto mb-2" size={48} />
                          <p className="text-red-400">Video URL not available</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info Section */}
                  <div className="p-6 bg-gradient-to-b from-transparent to-black/30">
                    {isVideoComplete && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4"
                      >
                        <p className="text-green-400 font-semibold text-sm">✓ Video completed! {triviaQuestions.length > 0 ? "Answer the questions below." : "Thank you for watching."}</p>
                      </motion.div>
                    )}
                    {video.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed">{video.description}</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Trivia Section */}
                  {!showResults ? (
                    <div className="p-8">
                      <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-sm font-semibold text-primary">Question {currentQuestionIndex + 1} of {triviaQuestions.length}</h4>
                          <div className="text-xs text-muted-foreground">
                            {Math.round((currentQuestionIndex / triviaQuestions.length) * 100)}% Complete
                          </div>
                        </div>
                        <div className="w-full bg-black/50 rounded-full h-2">
                          <motion.div
                            className="bg-gradient-to-r from-primary to-primary/60 h-2 rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: `${((currentQuestionIndex + 1) / triviaQuestions.length) * 100}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                      </div>

                      <motion.div
                        key={currentQuestionIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <h3 className="text-2xl font-bold text-white mb-8">{currentQuestion?.question}</h3>

                        <div className="space-y-3">
                          {currentQuestion?.options.map((option, index) => (
                            <motion.button
                              key={index}
                              onClick={() => handleAnswerSelect(index)}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                selectedAnswers[currentQuestionIndex] === index
                                  ? "border-primary bg-primary/20"
                                  : "border-primary/20 bg-card/50 hover:border-primary/40 hover:bg-card"
                              } ${
                                showResults
                                  ? index === currentQuestion?.correctAnswer
                                    ? "border-green-500 bg-green-500/10"
                                    : selectedAnswers[currentQuestionIndex] === index
                                      ? "border-red-500 bg-red-500/10"
                                      : ""
                                  : ""
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              disabled={showResults}
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                    selectedAnswers[currentQuestionIndex] === index
                                      ? "border-primary bg-primary"
                                      : "border-primary/40"
                                  }`}
                                >
                                  {selectedAnswers[currentQuestionIndex] === index && <div className="w-2 h-2 bg-white rounded-full" />}
                                </div>
                                <span className="text-white font-medium">{option}</span>
                              </div>
                            </motion.button>
                          ))}
                        </div>

                        {showResults && currentQuestion?.explanation && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg"
                          >
                            <p className="text-sm text-blue-200">
                              <span className="font-semibold">Explanation:</span> {currentQuestion.explanation}
                            </p>
                          </motion.div>
                        )}
                      </motion.div>
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="mb-6"
                      >
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mb-6">
                          <span className="text-5xl font-bold text-white">{calculateScore()}%</span>
                        </div>
                      </motion.div>
                      <h3 className="text-3xl font-bold text-white mb-2">Great job!</h3>
                      <p className="text-muted-foreground mb-8">
                        You scored {calculateScore()}% on this quiz. Keep learning and improving!
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                          <p className="text-2xl font-bold text-green-400">
                            {triviaQuestions.filter((q, i) => selectedAnswers[i] === q.correctAnswer).length}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">Correct Answers</p>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                          <p className="text-2xl font-bold text-red-400">
                            {triviaQuestions.length - triviaQuestions.filter((q, i) => selectedAnswers[i] === q.correctAnswer).length}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">Incorrect Answers</p>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer Controls */}
            {showTrivia && !showResults && (
              <div className="bg-gradient-to-t from-black to-transparent p-6 border-t border-primary/20 flex justify-between items-center">
                <motion.button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="px-6 py-2 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/10 rounded-lg transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  ← Previous
                </motion.button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {currentQuestionIndex + 1} of {triviaQuestions.length}
                  </p>
                </div>

                <motion.button
                  onClick={handleNextQuestion}
                  disabled={!isAnswered}
                  className="px-6 py-2 bg-primary text-black font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {currentQuestionIndex === triviaQuestions.length - 1 ? "See Results" : "Next →"}
                </motion.button>
              </div>
            )}

            {showResults && (
              <div className="bg-gradient-to-t from-black to-transparent p-6 border-t border-primary/20 flex justify-center gap-4">
                <motion.button
                  onClick={() => {
                    setShowTrivia(false)
                    setShowResults(false)
                    setCurrentQuestionIndex(0)
                    setSelectedAnswers([])
                    setIsVideoComplete(false)
                    setVideoProgress(0)
                  }}
                  className="px-6 py-2 bg-primary text-black font-bold rounded-lg hover:brightness-110 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Rewatch Video
                </motion.button>
                <motion.button
                  onClick={onClose}
                  className="px-6 py-2 border border-primary text-primary font-bold rounded-lg hover:bg-primary/10 transition"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
