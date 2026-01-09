"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Plus, Trash2, Edit2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface TriviaQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  category: string
  difficulty: "easy" | "medium" | "hard"
  created_at: string
}

interface AdminTriviaProps {
  adminId: string
}

export default function AdminTrivia({ adminId }: AdminTriviaProps) {
  const [questions, setQuestions] = useState<TriviaQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const [formData, setFormData] = useState({
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    correctAnswer: "option1",
    category: "",
    difficulty: "medium" as "easy" | "medium" | "hard",
  })

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/trivia")
      if (response.ok) {
        const data = await response.json()
        setQuestions(data.questions || [])
      }
    } catch (error) {
      console.error("Error fetching trivia questions:", error)
      setErrorMessage("Failed to load trivia questions")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      question: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      correctAnswer: "option1",
      category: "",
      difficulty: "medium",
    })
    setEditingId(null)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddQuestion = async () => {
    // Validation
    if (
      !formData.question ||
      !formData.option1 ||
      !formData.option2 ||
      !formData.option3 ||
      !formData.option4 ||
      !formData.category
    ) {
      setErrorMessage("Please fill in all fields")
      return
    }

    try {
      const payload = {
        question: formData.question,
        options: [formData.option1, formData.option2, formData.option3, formData.option4],
        correctAnswer: formData.correctAnswer,
        category: formData.category,
        difficulty: formData.difficulty,
        adminId,
      }

      const url = editingId
        ? `/api/admin/trivia?id=${editingId}`
        : "/api/admin/trivia"

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setSuccessMessage(
          editingId
            ? "Question updated successfully!"
            : "Question added successfully!"
        )
        resetForm()
        setIsOpen(false)
        await fetchQuestions()
        setTimeout(() => setSuccessMessage(""), 3000)
      } else {
        setErrorMessage("Failed to save question")
      }
    } catch (error) {
      console.error("Error saving question:", error)
      setErrorMessage("An error occurred while saving the question")
    }
  }

  const handleEdit = (question: TriviaQuestion) => {
    setFormData({
      question: question.question,
      option1: question.options[0],
      option2: question.options[1],
      option3: question.options[2],
      option4: question.options[3],
      correctAnswer: question.correctAnswer,
      category: question.category,
      difficulty: question.difficulty,
    })
    setEditingId(question.id)
    setIsOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return

    try {
      const response = await fetch(`/api/admin/trivia?id=${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setSuccessMessage("Question deleted successfully!")
        await fetchQuestions()
        setTimeout(() => setSuccessMessage(""), 3000)
      } else {
        setErrorMessage("Failed to delete question")
      }
    } catch (error) {
      console.error("Error deleting question:", error)
      setErrorMessage("An error occurred while deleting the question")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Trivia Questions</h1>
          <p className="text-gray-400 mt-1">Manage quiz trivia questions</p>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                resetForm()
                setIsOpen(true)
              }}
              className="bg-primary hover:bg-primary/90 text-black font-semibold"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Question
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-gray-900 border-primary/20 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingId ? "Edit Question" : "Add New Trivia Question"}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {editingId
                  ? "Update the trivia question details below"
                  : "Create a new trivia question for your quizzes"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Question */}
              <div>
                <label className="text-sm font-medium text-gray-300">
                  Question *
                </label>
                <Textarea
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  placeholder="Enter the trivia question"
                  className="mt-1 bg-gray-800 border-gray-700 text-white"
                  rows={3}
                />
              </div>

              {/* Category & Difficulty */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Category *
                  </label>
                  <Input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Science, History"
                    className="mt-1 bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300">
                    Difficulty
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="mt-1 w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Options */}
              <div>
                <label className="text-sm font-medium text-gray-300 block mb-3">
                  Answer Options *
                </label>
                <div className="space-y-2">
                  {["option1", "option2", "option3", "option4"].map((option) => (
                    <Input
                      key={option}
                      type="text"
                      name={option}
                      value={formData[option as keyof typeof formData] as string}
                      onChange={handleInputChange}
                      placeholder={`Option ${option.replace("option", "")}`}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                  ))}
                </div>
              </div>

              {/* Correct Answer */}
              <div>
                <label className="text-sm font-medium text-gray-300">
                  Correct Answer *
                </label>
                <select
                  name="correctAnswer"
                  value={formData.correctAnswer}
                  onChange={handleInputChange}
                  className="mt-1 w-full bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2"
                >
                  <option value="option1">Option 1</option>
                  <option value="option2">Option 2</option>
                  <option value="option3">Option 3</option>
                  <option value="option4">Option 4</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false)
                  resetForm()
                }}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddQuestion}
                className="bg-primary hover:bg-primary/90 text-black font-semibold"
              >
                {editingId ? "Update Question" : "Add Question"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Messages */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3 text-green-400"
        >
          <CheckCircle className="h-5 w-5" />
          {successMessage}
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 text-red-400"
        >
          <AlertCircle className="h-5 w-5" />
          {errorMessage}
        </motion.div>
      )}

      {/* Questions List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full"
          />
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-12 text-center">
          <p className="text-gray-400">No trivia questions yet. Create your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map((question) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-primary/30 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-2">{question.question}</h3>
                  <div className="space-y-1">
                    {question.options.map((option, idx) => (
                      <div
                        key={idx}
                        className={`text-sm px-2 py-1 rounded ${
                          question.correctAnswer === `option${idx + 1}`
                            ? "bg-green-500/20 text-green-400"
                            : "text-gray-400"
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}) {option}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mt-3 text-xs">
                    <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                      {question.category}
                    </span>
                    <span
                      className={`px-2 py-1 rounded ${
                        question.difficulty === "easy"
                          ? "bg-green-500/20 text-green-400"
                          : question.difficulty === "medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {question.difficulty}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(question)}
                    className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 p-2 rounded transition"
                    title="Edit"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(question.id)}
                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-2 rounded transition"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
