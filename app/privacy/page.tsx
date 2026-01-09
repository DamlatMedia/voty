"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { usePageSettings } from "@/hooks/use-page-settings"
import { motion } from "framer-motion"

export default function PrivacyPolicy() {
  const { settings, loading, mounted } = usePageSettings()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="bg-black min-h-screen">
      <Header isScrolled={isScrolled} />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">
              Last updated: {mounted && !loading && settings.updated_at 
                ? new Date(settings.updated_at).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })
                : 'Loading...'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-card border border-primary/20 rounded-2xl p-8 md:p-12 text-foreground space-y-6 prose prose-invert max-w-none"
          >
            {mounted && !loading ? (
              <div
                className="text-base leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: settings.privacy_policy_content?.replace(/\n/g, "<br />") || 
                    "Privacy policy content will appear here once updated by the administrator.",
                }}
              />
            ) : (
              <p className="text-muted-foreground">Loading privacy policy...</p>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
