"use client"
import { motion } from "framer-motion"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

// Mock votes for different categories
const mockVotesByCategory: Record<string, any[]> = {
  trending: [
    {
      id: 1,
      title: "Best Moral Story Vote",
      description: "Choose between two inspiring tales",
      optionA: "Integrity Tale",
      optionB: "Courage Quest",
      votesA: 1247,
      votesB: 890,
      participants: 2137,
    },
    {
      id: 2,
      title: "Youth Role Model #2",
      description: "Who inspires you more?",
      optionA: "Local Hero",
      optionB: "Global Icon",
      votesA: 1567,
      votesB: 1234,
      participants: 2801,
    },
    {
      id: 3,
      title: "Social Change #3",
      description: "What matters most?",
      optionA: "Education",
      optionB: "Healthcare",
      votesA: 2134,
      votesB: 1567,
      participants: 3701,
    },
    {
      id: 4,
      title: "Career Path #4",
      description: "Which is better?",
      optionA: "Tech Startup",
      optionB: "Corporate Job",
      votesA: 1456,
      votesB: 1289,
      participants: 2745,
    },
    {
      id: 5,
      title: "Communication #5",
      description: "Best way to connect?",
      optionA: "Face-to-Face",
      optionB: "Digital",
      votesA: 1123,
      votesB: 945,
      participants: 2068,
    },
    {
      id: 6,
      title: "Learning Style #6",
      description: "How do you learn best?",
      optionA: "Practical",
      optionB: "Theoretical",
      votesA: 1678,
      votesB: 1456,
      participants: 3134,
    },
    {
      id: 7,
      title: "Community Service #7",
      description: "What should we focus on?",
      optionA: "Environment",
      optionB: "Social Issues",
      votesA: 1345,
      votesB: 1267,
      participants: 2612,
    },
    {
      id: 8,
      title: "Future Vision #8",
      description: "Nigeria in 2050?",
      optionA: "Tech Hub",
      optionB: "Cultural Center",
      votesA: 1789,
      votesB: 1456,
      participants: 3245,
    },
    {
      id: 9,
      title: "Personal Growth #9",
      description: "Most important?",
      optionA: "Self-Discipline",
      optionB: "Support System",
      votesA: 1234,
      votesB: 1567,
      participants: 2801,
    },
    {
      id: 10,
      title: "Social Impact #10",
      description: "Priority initiative?",
      optionA: "Youth Empowerment",
      optionB: "Skill Training",
      votesA: 1567,
      votesB: 1234,
      participants: 2801,
    },
  ],
  participating: [
    {
      id: 11,
      title: "Current Vote #1",
      description: "Your vote matters here",
      optionA: "Option A",
      optionB: "Option B",
      votesA: 2345,
      votesB: 1876,
      participants: 4221,
    },
    {
      id: 12,
      title: "Active Poll #2",
      description: "Join the conversation",
      optionA: "Choice 1",
      optionB: "Choice 2",
      votesA: 1923,
      votesB: 2134,
      participants: 4057,
    },
    {
      id: 13,
      title: "Your Voice #3",
      description: "Make a difference",
      optionA: "Path A",
      optionB: "Path B",
      votesA: 2567,
      votesB: 1945,
      participants: 4512,
    },
    {
      id: 14,
      title: "Community Poll #4",
      description: "We need your input",
      optionA: "Preference 1",
      optionB: "Preference 2",
      votesA: 1678,
      votesB: 2234,
      participants: 3912,
    },
    {
      id: 15,
      title: "Live Vote #5",
      description: "Happening right now",
      optionA: "Trending A",
      optionB: "Trending B",
      votesA: 2456,
      votesB: 2123,
      participants: 4579,
    },
    {
      id: 16,
      title: "Ongoing Poll #6",
      description: "Still open for voting",
      optionA: "Option X",
      optionB: "Option Y",
      votesA: 1834,
      votesB: 1567,
      participants: 3401,
    },
    {
      id: 17,
      title: "Active Survey #7",
      description: "Your contribution counts",
      optionA: "Vote A",
      optionB: "Vote B",
      votesA: 2789,
      votesB: 2134,
      participants: 4923,
    },
    {
      id: 18,
      title: "Real-time Vote #8",
      description: "Latest poll",
      optionA: "Option I",
      optionB: "Option II",
      votesA: 2012,
      votesB: 1876,
      participants: 3888,
    },
    {
      id: 19,
      title: "Fresh Poll #9",
      description: "New voting opportunity",
      optionA: "Selection A",
      optionB: "Selection B",
      votesA: 2345,
      votesB: 1912,
      participants: 4257,
    },
    {
      id: 20,
      title: "Current Survey #10",
      description: "Help shape the future",
      optionA: "Future A",
      optionB: "Future B",
      votesA: 1567,
      votesB: 2134,
      participants: 3701,
    },
  ],
  results: [
    {
      id: 21,
      title: "Past Vote Results #1",
      description: "See what won",
      optionA: "Winner",
      optionB: "Runner-up",
      votesA: 3456,
      votesB: 2123,
      participants: 5579,
    },
    {
      id: 22,
      title: "Completed Poll #2",
      description: "Final tally",
      optionA: "Choice A Won",
      optionB: "Choice B",
      votesA: 2789,
      votesB: 1567,
      participants: 4356,
    },
    {
      id: 23,
      title: "Closed Vote #3",
      description: "Results revealed",
      optionA: "Victory A",
      optionB: "Defeat B",
      votesA: 4123,
      votesB: 1945,
      participants: 6068,
    },
    {
      id: 24,
      title: "Historic Vote #4",
      description: "Looking back",
      optionA: "Historical Winner",
      optionB: "Historical Option",
      votesA: 3234,
      votesB: 2456,
      participants: 5690,
    },
    {
      id: 25,
      title: "Week Result #5",
      description: "This week's winner",
      optionA: "Champion",
      optionB: "Challenger",
      votesA: 2567,
      votesB: 1876,
      participants: 4443,
    },
    {
      id: 26,
      title: "Season Final #6",
      description: "Grand finale results",
      optionA: "Season Winner",
      optionB: "Runner-up",
      votesA: 5234,
      votesB: 3456,
      participants: 8690,
    },
    {
      id: 27,
      title: "Month Recap #7",
      description: "Monthly results",
      optionA: "Month Winner",
      optionB: "Second Place",
      votesA: 3789,
      votesB: 2345,
      participants: 6134,
    },
    {
      id: 28,
      title: "All-time Result #8",
      description: "Most voted ever",
      optionA: "All-time Winner",
      optionB: "Historic Option",
      votesA: 6789,
      votesB: 4567,
      participants: 11356,
    },
    {
      id: 29,
      title: "Quarter Result #9",
      description: "Q3 results",
      optionA: "Quarterly Champion",
      optionB: "Quarterly Option",
      votesA: 4123,
      votesB: 3456,
      participants: 7579,
    },
    {
      id: 30,
      title: "Annual Vote #10",
      description: "Year's most voted",
      optionA: "Annual Winner",
      optionB: "Annual Option",
      votesA: 7234,
      votesB: 5123,
      participants: 12357,
    },
  ],
}

export default function CategoryVotesPage() {
  const params = useParams()
  const router = useRouter()
  const category = params.category as string
  const votes = mockVotesByCategory[category] || mockVotesByCategory["trending"]

  const categoryTitles: Record<string, string> = {
    trending: "Trending Votes",
    participating: "Votes You're Participating In",
    results: "Vote Results",
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
            <h1 className="text-4xl font-bold text-white mb-2">{categoryTitles[category] || "Votes"}</h1>
            <p className="text-muted-foreground">View all votes in this category</p>
          </div>
        </motion.div>

        {/* Votes Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {votes.map((vote, idx) => (
            <motion.div
              key={vote.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-card border border-primary/20 rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/20"
            >
              <h3 className="text-lg font-bold text-white mb-2">{vote.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{vote.description}</p>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-white">{vote.optionA}</span>
                    <span className="text-xs text-primary">
                      {Math.round((vote.votesA / (vote.votesA + vote.votesB)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(vote.votesA / (vote.votesA + vote.votesB)) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-white">{vote.optionB}</span>
                    <span className="text-xs text-primary">
                      {Math.round((vote.votesB / (vote.votesA + vote.votesB)) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div
                      className="bg-primary/50 h-2 rounded-full transition-all"
                      style={{ width: `${(vote.votesB / (vote.votesA + vote.votesB)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-4">{vote.participants.toLocaleString()} participants</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
