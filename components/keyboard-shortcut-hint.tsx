"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Command } from "lucide-react"

export function KeyboardShortcutHint() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 left-4 flex items-center gap-2 text-xs text-muted-foreground bg-card/50 border border-primary/20 px-3 py-2 rounded-lg backdrop-blur-sm"
        >
          <Command size={14} />
          <span>
            Press <kbd className="px-2 py-1 rounded bg-background text-foreground">?</kbd> for shortcuts
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
