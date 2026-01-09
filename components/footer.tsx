"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePageSettings } from "@/hooks/use-page-settings"

export default function Footer() {
  const { settings, loading, mounted } = usePageSettings()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  return (
    <footer className="bg-black border-t border-primary/20 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {!loading && mounted && (
          <>
            <motion.div
              className="grid md:grid-cols-4 gap-8 mb-12"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Brand */}
              <motion.div variants={itemVariants}>
                {settings.site_image && (
                  <div className="relative w-32 h-12 mb-4">
                    <Image
                      src={settings.site_image}
                      alt={settings.brand_name}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
                <p className="text-foreground/70">{settings.footer_about}</p>
              </motion.div>

              {/* Quick Links */}
              <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold text-primary mb-4">Quick Links</h4>
            <ul className="space-y-2 text-foreground/70">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold text-primary mb-4">Legal</h4>
            <ul className="space-y-2 text-foreground/70">
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold text-primary mb-4">Contact</h4>
            <div className="space-y-3 text-foreground/70">
              {settings.footer_contact_email && (
                <p className="flex items-center gap-2">
                  <Mail size={18} className="text-primary flex-shrink-0" />
                  <a href={`mailto:${settings.footer_contact_email}`} className="hover:text-primary transition-colors">
                    {settings.footer_contact_email}
                  </a>
                </p>
              )}
              {settings.footer_contact_phone && (
                <p className="flex items-center gap-2">
                  <Phone size={18} className="text-primary flex-shrink-0" />
                  <a href={`tel:${settings.footer_contact_phone}`} className="hover:text-primary transition-colors">
                    {settings.footer_contact_phone}
                  </a>
                </p>
              )}
              {settings.footer_contact_location && (
                <p className="flex items-center gap-2">
                  <MapPin size={18} className="text-primary flex-shrink-0" />
                  <span>{settings.footer_contact_location}</span>
                </p>
              )}
            </div>
          </motion.div>

          {/* Social */}
          <motion.div variants={itemVariants}>
            <h4 className="text-lg font-bold text-primary mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href={settings.social_facebook || "#"}
                target={settings.social_facebook ? "_blank" : undefined}
                rel={settings.social_facebook ? "noopener noreferrer" : undefined}
                className="w-10 h-10 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary/10 transition-all hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href={settings.social_twitter || "#"}
                target={settings.social_twitter ? "_blank" : undefined}
                rel={settings.social_twitter ? "noopener noreferrer" : undefined}
                className="w-10 h-10 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary/10 transition-all hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href={settings.social_instagram || "#"}
                target={settings.social_instagram ? "_blank" : undefined}
                rel={settings.social_instagram ? "noopener noreferrer" : undefined}
                className="w-10 h-10 rounded-full border border-primary flex items-center justify-center text-primary hover:bg-primary/10 transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Closing Message */}
        <motion.div
          className="text-center border-t border-primary/20 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-2xl italic text-primary mb-4">
            {settings.footer_brand_text}
          </p>
          
          <button className="px-8 py-3 bg-primary text-black rounded-full font-bold hover:bg-primary/90 transition-all glow-gold-hover">
            Get Started
          </button>
        </motion.div>

        {/* Copyright */}
        <div className="text-center text-foreground/50 text-sm mt-8">
          <p>&copy; {new Date().getFullYear()} {settings.site_name} - {settings.brand_tagline}. All rights reserved.</p>
        </div>
          </>
        )}
      </div>
    </footer>
  )
}
