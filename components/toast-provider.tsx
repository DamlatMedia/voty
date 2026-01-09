"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ToastProvider() {
  const { toasts, dismiss } = useToast()

  const getIcon = (type?: string) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} className="text-green-400" />
      case "error":
        return <AlertCircle size={20} className="text-red-400" />
      default:
        return <Info size={20} className="text-primary" />
    }
  }

  const getStyles = (type?: string) => {
    switch (type) {
      case "success":
        return "bg-green-500/10 border-green-500/30 text-green-400"
      case "error":
        return "bg-red-500/10 border-red-500/30 text-red-400"
      default:
        return "bg-primary/10 border-primary/30 text-primary"
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 100 }}
            className={`flex items-start gap-3 p-4 rounded-2xl border ${getStyles(toast.variant)} pointer-events-auto`}
          >
            {getIcon(toast.variant)}
            <div className="flex-1">
              {toast.title && <p className="font-semibold">{toast.title}</p>}
              {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="opacity-70 hover:opacity-100 transition"
              aria-label="Close toast"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
