"use client"

import { motion } from "framer-motion"
import VideosGrid from "@/components/dashboard/videos-grid"

export default function VideosPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl md:text-5xl font-bold text-gold mb-4">All Videos</h1>
        <p className="text-muted-foreground mb-8">Explore our full library of educational content</p>
      </motion.div>

      <VideosGrid />
    </div>
  )
}
