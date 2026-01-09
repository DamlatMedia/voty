"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export default function DescriptionSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-5xl mx-auto">
        {/* Divider */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
          <span className="text-primary font-semibold">MISSION</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-primary to-transparent" />
        </div>

        {/* Description */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-lg sm:text-xl text-foreground leading-relaxed">
            At its core, VOTY aims to foster positive growth among young minds by providing content like moral stories,
            engaging trivia quizzes, and pathways to scholarships and rewards for academic excellence. The platform
            emphasizes teaching ethical values, recognizing high-achieving students, and equipping them with tools to
            shape their futures in a supportive environment.
          </p>
        </motion.div>

        {/* Image */}
        <motion.div
          className="relative h-96 rounded-lg overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Image src="/nigerian-teen-reading-inspirational-story.jpg" alt="Description" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </motion.div>

        {/* Bottom Divider */}
        <div className="flex items-center gap-4 mt-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
        </div>
      </div>
    </section>
  )
}
