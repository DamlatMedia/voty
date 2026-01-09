"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import DescriptionSection from "@/components/description-section"
import FeaturesSection from "@/components/features-section"
import VideoHubSection from "@/components/video-hub-section"
import Footer from "@/components/footer"

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="bg-black min-h-screen overflow-x-hidden">
      <Header isScrolled={isScrolled} />
      <HeroSection />
      <DescriptionSection />
      <FeaturesSection />
      <VideoHubSection />
      <Footer />
    </main>
  )
}
