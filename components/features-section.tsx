"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { usePageSettings } from "@/hooks/use-page-settings"

export default function FeaturesSection() {
  const { settings, loading, mounted } = usePageSettings()

  // Only use database features - no hardcoded fallback
  const features = settings.features_list && settings.features_list.length > 0 
    ? settings.features_list.map((feature: any, index: number) => ({
        title: feature.title || `Feature ${index + 1}`,
        description: feature.description || '',
        image: feature.image || "/placeholder.svg",
      }))
    : []
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-7xl mx-auto">
        {!loading && mounted && (
          <>
            <motion.h2
              className="text-4xl sm:text-5xl font-bold text-center text-primary mb-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {settings.features_title}
            </motion.h2>

            <motion.div
              className="grid md:grid-cols-2 gap-8"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="border border-primary rounded-lg p-6 hover:shadow-lg transition-all duration-300 group"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(212, 175, 55, 0.3)" }}
                >
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-primary mb-3">{feature.title}</h3>

                  {/* Description */}
                  <p className="text-white mb-6">{feature.description}</p>

                  {/* Image */}
                  <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                    <Image
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </section>
  )
}
