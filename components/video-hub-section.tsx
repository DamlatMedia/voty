"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"

const videos = [
  {
    title: "Moral Stories",
    description: "Inspiring tales of ethical growth",
    thumbnail: "/moral-story-video-thumbnail-gold-lighting.jpg",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    title: "Trivia Challenge",
    description: "Test your knowledge",
    thumbnail: "/trivia-challenge-nigerian-youth-video.jpg",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    title: "Success Stories",
    description: "Testimonials from achievers",
    thumbnail: "/success-testimonial-video-gold-accent.jpg",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
]

export default function VideoHubSection() {
  const [selectedVideo, setSelectedVideo] = useState<(typeof videos)[0] | null>(null)

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl sm:text-5xl font-bold text-center text-primary mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Inspirational Streams
        </motion.h2>

        <p className="text-center text-foreground/70 mb-16">Watch powerful content that inspires and educates</p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {videos.map((video, index) => (
            <motion.div
              key={index}
              className="relative group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              onClick={() => setSelectedVideo(video)}
            >
              <div className="relative h-48 rounded-lg overflow-hidden border border-primary">
                <Image
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />

                {/* Play Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-primary flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <svg className="w-8 h-8 text-primary ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-bold text-primary">{video.title}</h3>
                <p className="text-foreground/60">{video.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              className="w-full max-w-4xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <iframe
                  src={selectedVideo.url}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="mt-4 px-6 py-2 bg-primary text-black rounded-full font-bold hover:bg-primary/90 transition-all"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
