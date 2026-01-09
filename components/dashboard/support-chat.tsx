"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send } from "lucide-react"
import { useRouter } from "next/navigation"

interface SupportChatProps {
  isOpen?: boolean
  setIsOpen?: (open: boolean) => void
}

export default function SupportChat({ isOpen = false, setIsOpen }: SupportChatProps) {
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState("")
  const [internalOpen, setInternalOpen] = useState(isOpen)
  const router = useRouter()

  const open = setIsOpen ? isOpen : internalOpen
  const setOpen = setIsOpen || setInternalOpen

  const handleSendMessage = () => {
    if (message.trim()) {
      setMessage("")
      setShowForm(false)
    }
  }

  const handleContactSupport = () => {
    router.push("/contact")
  }

  return (
    <>
      {/* Floating Chat Button */}
      <motion.button
        onClick={() => setOpen(!open)}
        className="fixed bottom-8 right-8 bg-primary text-black rounded-full p-4 shadow-lg hover:shadow-gold glow-gold-hover transition z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        aria-label="Open support chat"
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Chat Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-8 bg-card rounded-xl border border-primary/30 w-80 shadow-lg z-40"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-primary/30 bg-background rounded-t-xl">
              <h3 className="text-lg font-bold text-primary">Support</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-primary hover:text-primary/80 transition"
                aria-label="Close support"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {!showForm ? (
                <>
                  <p className="text-white text-sm">How can we help you today?</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full bg-primary text-black py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
                    aria-label="Send message"
                  >
                    Send Message
                  </button>
                  <button
                    onClick={handleContactSupport}
                    className="w-full bg-primary/20 text-primary py-2 rounded-lg font-semibold hover:bg-primary/30 transition"
                  >
                    Contact Support
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full bg-background text-white p-2 rounded-lg border border-primary/30 focus:border-primary outline-none transition resize-none"
                    rows={3}
                    aria-label="Support message"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowForm(false)}
                      className="flex-1 bg-muted text-white py-2 rounded-lg hover:bg-muted/80 transition"
                      aria-label="Cancel message"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendMessage}
                      className="flex-1 bg-primary text-black py-2 rounded-lg hover:bg-primary/90 transition flex items-center justify-center gap-2"
                      aria-label="Send support message"
                    >
                      <Send size={16} />
                      Send
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
