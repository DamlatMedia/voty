"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, Award } from "lucide-react"

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"pending" | "votes" | "winners">("pending")

  const pendingVideos = [
    { id: "1", title: "Youth Empowerment Talk", creator: "John Doe", status: "pending" },
    { id: "2", title: "Educational Workshop", creator: "Jane Smith", status: "pending" },
  ]

  const votes = [
    { id: "1", video: "Moral Story", votes: 1250 },
    { id: "2", video: "Educational Discussion", votes: 980 },
    { id: "3", video: "Trivia Challenge", votes: 650 },
  ]

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        {["pending", "votes", "winners"].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-3 rounded-lg font-semibold capitalize transition ${
              activeTab === tab ? "bg-gold text-black" : "bg-card text-white hover:bg-card/80"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {tab}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "pending" && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {pendingVideos.map((video) => (
              <div
                key={video.id}
                className="bg-card border border-primary/30 rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-bold text-white">{video.title}</h3>
                  <p className="text-sm text-primary">by {video.creator}</p>
                </div>
                <div className="flex gap-3">
                  <motion.button
                    className="bg-green-500/20 text-green-400 p-3 rounded-lg hover:bg-green-500/30 transition"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Approve"
                  >
                    <Check size={20} />
                  </motion.button>
                  <motion.button
                    className="bg-red-500/20 text-red-400 p-3 rounded-lg hover:bg-red-500/30 transition"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Reject"
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === "votes" && (
          <motion.div
            key="votes"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {votes.map((vote) => (
              <div key={vote.id} className="bg-card border border-primary/30 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-bold text-white">{vote.video}</h3>
                  <span className="text-gold font-bold text-xl">{vote.votes} votes</span>
                </div>
                <div className="w-full bg-background rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-gold to-primary h-full rounded-full"
                    style={{ width: `${(vote.votes / 1250) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {activeTab === "winners" && (
          <motion.div
            key="winners"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-card border border-primary/30 rounded-xl p-6"
          >
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Award className="text-gold" /> Select Winner
            </h3>
            <div className="space-y-4">
              <select className="w-full bg-background text-white p-3 rounded-lg border border-primary/30">
                <option value="">Choose a video winner...</option>
                {votes.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.video} ({v.votes} votes)
                  </option>
                ))}
              </select>
              <select className="w-full bg-background text-white p-3 rounded-lg border border-primary/30">
                <option value="">Select prize...</option>
                <option value="laptop">Laptop</option>
                <option value="phone">Phone</option>
                <option value="scholarship">Scholarship</option>
              </select>
              <motion.button
                className="w-full bg-gold text-black py-3 rounded-lg font-bold hover:bg-gold/90 transition"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Assign Prize
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
