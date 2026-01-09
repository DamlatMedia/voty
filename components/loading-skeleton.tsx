"use client"

import { motion } from "framer-motion"

export function LoadingSkeleton() {
  return (
    <motion.div
      className="space-y-4"
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
    >
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-card rounded-lg h-32 border border-primary/20" />
      ))}
    </motion.div>
  )
}
