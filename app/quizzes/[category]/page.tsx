"use client"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import QuizCard from "@/components/dashboard/quiz-card"

// Mock quizzes for different categories
const mockQuizzesByCategory: Record<string, any[]> = {
  live: [
    {
      id: 1,
      title: "Ethics Trivia #1",
      description: "Test your knowledge on moral values with 10 questions",
      difficulty: "Medium",
      participants: 2345,
      duration: "10 mins",
    },
    {
      id: 2,
      title: "Nigerian History Quiz #2",
      description: "Explore the rich history of Nigeria",
      difficulty: "Medium",
      participants: 1876,
      duration: "12 mins",
    },
    {
      id: 3,
      title: "Youth Values Challenge #3",
      description: "What do Nigerian youth believe in?",
      difficulty: "Hard",
      participants: 3124,
      duration: "15 mins",
    },
    {
      id: 4,
      title: "Cultural Awareness #4",
      description: "Know your culture",
      difficulty: "Easy",
      participants: 2567,
      duration: "8 mins",
    },
    {
      id: 5,
      title: "Leadership Quiz #5",
      description: "Are you a born leader?",
      difficulty: "Medium",
      participants: 1945,
      duration: "12 mins",
    },
    {
      id: 6,
      title: "Social Impact Challenge #6",
      description: "Making a difference matters",
      difficulty: "Medium",
      participants: 2234,
      duration: "11 mins",
    },
    {
      id: 7,
      title: "Innovation Trivia #7",
      description: "The future belongs to innovators",
      difficulty: "Hard",
      participants: 1678,
      duration: "13 mins",
    },
    {
      id: 8,
      title: "Community Service Quiz #8",
      description: "Giving back to society",
      difficulty: "Easy",
      participants: 2891,
      duration: "9 mins",
    },
    {
      id: 9,
      title: "Critical Thinking #9",
      description: "Test your analytical skills",
      difficulty: "Hard",
      participants: 1523,
      duration: "14 mins",
    },
    {
      id: 10,
      title: "Life Wisdom Trivia #10",
      description: "Ancient and modern wisdom combined",
      difficulty: "Medium",
      participants: 2756,
      duration: "12 mins",
    },
  ],
  past: [
    {
      id: 11,
      title: "History Flashback #1",
      description: "Revisit classic questions",
      difficulty: "Easy",
      participants: 3456,
      duration: "10 mins",
    },
    {
      id: 12,
      title: "Archive Challenge #2",
      description: "Questions from previous weeks",
      difficulty: "Medium",
      participants: 2789,
      duration: "11 mins",
    },
    {
      id: 13,
      title: "Classics Encore #3",
      description: "Your favorite past quizzes",
      difficulty: "Medium",
      participants: 2134,
      duration: "10 mins",
    },
    {
      id: 14,
      title: "Memory Test #4",
      description: "Do you remember?",
      difficulty: "Easy",
      participants: 2945,
      duration: "8 mins",
    },
    {
      id: 15,
      title: "Throwback Quiz #5",
      description: "Going back in time",
      difficulty: "Medium",
      participants: 1876,
      duration: "12 mins",
    },
    {
      id: 16,
      title: "Legacy Questions #6",
      description: "Timeless queries",
      difficulty: "Hard",
      participants: 1567,
      duration: "13 mins",
    },
    {
      id: 17,
      title: "Previous Seasons #7",
      description: "Best of past seasons",
      difficulty: "Medium",
      participants: 2456,
      duration: "11 mins",
    },
    {
      id: 18,
      title: "Archive Gems #8",
      description: "Hidden treasures from past",
      difficulty: "Easy",
      participants: 2123,
      duration: "9 mins",
    },
    {
      id: 19,
      title: "Retro Challenge #9",
      description: "Vintage questions",
      difficulty: "Medium",
      participants: 1834,
      duration: "10 mins",
    },
    {
      id: 20,
      title: "Historical Quiz #10",
      description: "Building on the past",
      difficulty: "Medium",
      participants: 2567,
      duration: "12 mins",
    },
  ],
  trivia: [
    {
      id: 21,
      title: "Fun Facts #1",
      description: "Did you know? Trivia edition",
      difficulty: "Easy",
      participants: 4567,
      duration: "5 mins",
    },
    {
      id: 22,
      title: "Brain Teaser #2",
      description: "Puzzle your mind",
      difficulty: "Hard",
      participants: 2345,
      duration: "8 mins",
    },
    {
      id: 23,
      title: "Quick Fire #3",
      description: "Fast-paced trivia fun",
      difficulty: "Medium",
      participants: 3234,
      duration: "6 mins",
    },
    {
      id: 24,
      title: "Mystery Quiz #4",
      description: "Uncover the unknown",
      difficulty: "Hard",
      participants: 1923,
      duration: "10 mins",
    },
    {
      id: 25,
      title: "Rapid Fire #5",
      description: "Speed round trivia",
      difficulty: "Medium",
      participants: 2876,
      duration: "5 mins",
    },
    {
      id: 26,
      title: "Mind Bender #6",
      description: "Challenge your logic",
      difficulty: "Hard",
      participants: 1645,
      duration: "12 mins",
    },
    {
      id: 27,
      title: "Quick Wit #7",
      description: "Test your reflexes",
      difficulty: "Easy",
      participants: 3456,
      duration: "4 mins",
    },
    {
      id: 28,
      title: "Brain Puzzle #8",
      description: "Solve the riddle",
      difficulty: "Hard",
      participants: 1812,
      duration: "9 mins",
    },
    {
      id: 29,
      title: "Lightning Round #9",
      description: "Answers in a flash",
      difficulty: "Medium",
      participants: 2567,
      duration: "6 mins",
    },
    {
      id: 30,
      title: "Ultimate Trivia #10",
      description: "The ultimate challenge",
      difficulty: "Hard",
      participants: 1423,
      duration: "15 mins",
    },
  ],
}

export default function CategoryQuizzesPage() {
  const params = useParams()
  const router = useRouter()
  const category = params.category as string
  const quizzes = mockQuizzesByCategory[category] || mockQuizzesByCategory["live"]

  const categoryTitles: Record<string, string> = {
    live: "Live Quizzes",
    past: "Past Quizzes",
    trivia: "Trivia Challenges",
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-4"
        >
          <button onClick={() => router.back()} className="p-2 hover:bg-primary/10 rounded-lg text-primary transition">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{categoryTitles[category] || "Quizzes"}</h1>
            <p className="text-muted-foreground">Explore all quizzes in this category</p>
          </div>
        </motion.div>

        {/* Quizzes Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
        >
          {quizzes.map((quiz, idx) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <QuizCard quiz={quiz} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
