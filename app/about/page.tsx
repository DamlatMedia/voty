"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { motion } from "framer-motion"

export default function About() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const values = [
    {
      title: "Empowerment",
      description: "We believe in empowering every youth with knowledge and skills to succeed.",
    },
    {
      title: "Integrity",
      description: "Honesty and ethical conduct are the foundation of everything we do.",
    },
    {
      title: "Community",
      description: "Together, we build a supportive network of young leaders and innovators.",
    },
    {
      title: "Excellence",
      description: "We strive for excellence in every program and opportunity we offer.",
    },
  ]

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
            <h1 className="text-5xl md:text-6xl font-bold text-primary mb-6">About VOTY</h1>
            <p className="text-xl text-muted-foreground">
              Voice of the Teenagers and the Youths - Empowering Nigerian youth through education, ethics, and
              skill-building
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-primary/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-primary mb-6">Our Mission</h2>
            <p className="text-lg text-foreground leading-relaxed">
              At VOTY, our mission is to inspire, educate, and empower Nigerian youth to become leaders and changemakers
              in their communities. We provide a platform for young voices to be heard, recognized, and celebrated.
              Through our comprehensive programs encompassing moral education, skill development, and mentorship, we aim
              to shape a generation of ethical, capable, and confident individuals ready to tackle the challenges of the
              modern world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card/30 border-t border-primary/20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-primary mb-6">Our Vision</h2>
            <p className="text-lg text-foreground leading-relaxed">
              We envision a Nigeria where every young person has access to quality education, ethical guidance, and
              skill development opportunities. A nation where youth voices matter, where their potential is recognized
              and nurtured, and where they can confidently pursue their dreams and contribute meaningfully to society's
              progress.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-primary/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-primary mb-12 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card border border-primary/20 rounded-xl p-6 hover:border-primary/50 transition-all"
              >
                <h3 className="text-2xl font-bold text-primary mb-3">{value.title}</h3>
                <p className="text-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
