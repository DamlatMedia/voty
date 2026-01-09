"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, AlertCircle, Info, X } from "lucide-react"
import { Toast } from "@/hooks/use-toast-simple"

interface ToastDisplayProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastDisplay({ toasts, onRemove }: ToastDisplayProps) {
  return (
    <AnimatePresence>
      <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, x: 400 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: 400 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border ${
              toast.type === "success"
                ? "bg-green-500/10 border-green-500/30 text-green-200"
                : toast.type === "error"
                  ? "bg-red-500/10 border-red-500/30 text-red-200"
                  : "bg-blue-500/10 border-blue-500/30 text-blue-200"
            }`}
          >
            {toast.type === "success" && <CheckCircle size={20} className="flex-shrink-0" />}
            {toast.type === "error" && <AlertCircle size={20} className="flex-shrink-0" />}
            {toast.type === "info" && <Info size={20} className="flex-shrink-0" />}

            <span className="flex-1 text-sm font-medium">{toast.message}</span>

            <button
              onClick={() => onRemove(toast.id)}
              className="flex-shrink-0 hover:opacity-70 transition"
            >
              <X size={18} />
            </button>
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  )
}
