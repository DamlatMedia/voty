"use client"

import { useState } from "react"

interface QuizAnswer {
  questionId: number
  selectedAnswer: number
}

export function useQuizState() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [showResults, setShowResults] = useState(false)

  const selectAnswer = (questionId: number, answerIndex: number) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId)
      if (existing) {
        return prev.map((a) => (a.questionId === questionId ? { ...a, selectedAnswer: answerIndex } : a))
      }
      return [...prev, { questionId, selectedAnswer: answerIndex }]
    })
  }

  const nextQuestion = () => {
    setCurrentQuestion((prev) => prev + 1)
  }

  const reset = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setShowResults(false)
  }

  return {
    currentQuestion,
    answers,
    showResults,
    setShowResults,
    selectAnswer,
    nextQuestion,
    reset,
  }
}
