"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface DatePickerProps {
  value: string
  onChange: (date: string) => void
  placeholder?: string
  maxDate?: Date
  minDate?: Date
}

export default function DatePicker({
  value,
  onChange,
  placeholder = "Select date of birth",
  maxDate = new Date(),
  minDate = new Date(1900, 0, 1),
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentDate, setCurrentDate] = React.useState(new Date(maxDate.getFullYear() - 20, 0, 1))
  const [selectedDay, setSelectedDay] = React.useState<number | null>(null)
  const [step, setStep] = React.useState<"month" | "year">("month")

  // Parse value if it exists
  React.useEffect(() => {
    if (value) {
      const parts = value.split("-")
      if (parts.length === 3) {
        setSelectedDay(parseInt(parts[2]))
        setCurrentDate(new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, 1))
      }
    }
  }, [value])

  const handleDayClick = (day: number) => {
    const year = currentDate.getFullYear()
    const month = String(currentDate.getMonth() + 1).padStart(2, "0")
    const dayStr = String(day).padStart(2, "0")
    const newDate = `${year}-${month}-${dayStr}`
    onChange(newDate)
    setSelectedDay(day)
    setIsOpen(false)
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handlePrevYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1))
  }

  const handleNextYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1))
  }

  const handleYearSelect = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1))
    setStep("month")
  }

  const handleMonthSelect = (month: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), month, 1))
    setStep("month")
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return placeholder
    const [year, month, day] = dateStr.split("-")
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day))
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  const yearOptions = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)

  return (
    <div className="relative w-full">
      {/* Input Field */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all text-left flex justify-between items-center"
        whileHover={{ borderColor: "rgba(255, 165, 0, 0.4)" }}
      >
        <span className={value ? "text-foreground" : "text-muted-foreground"}>{formatDisplayDate(value)}</span>
        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </motion.button>

      {/* Calendar Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-card border border-primary/30 rounded-lg shadow-lg p-4 z-50 w-full sm:w-80"
          >
            {/* Month/Year Header */}
            <div className="flex items-center justify-between mb-4">
              <motion.button
                onClick={step === "month" ? handlePrevMonth : handlePrevYear}
                className="p-1 hover:bg-primary/20 rounded transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={20} className="text-primary" />
              </motion.button>

              <div className="flex gap-2">
                <motion.button
                  onClick={() => setStep(step === "month" ? "year" : "month")}
                  className="px-3 py-1 rounded hover:bg-primary/20 transition text-primary font-semibold"
                  whileHover={{ scale: 1.05 }}
                >
                  {step === "month" ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}` : `Select Year`}
                </motion.button>
              </div>

              <motion.button
                onClick={step === "month" ? handleNextMonth : handleNextYear}
                className="p-1 hover:bg-primary/20 rounded transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight size={20} className="text-primary" />
              </motion.button>
            </div>

            {/* Year Selection */}
            {step === "year" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto"
              >
                {yearOptions.map((year) => (
                  <motion.button
                    key={year}
                    onClick={() => handleYearSelect(year)}
                    className={`py-2 px-2 rounded text-sm transition ${
                      currentDate.getFullYear() === year ? "bg-primary text-black font-bold" : "hover:bg-primary/20"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {year}
                  </motion.button>
                ))}
              </motion.div>
            )}

            {/* Month Selection */}
            {step === "month" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Day of week headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div key={day} className="text-center text-xs text-muted-foreground font-semibold py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for days before month starts */}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                  ))}

                  {/* Days of month */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const isSelected = selectedDay === day
                    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                    const isDisabled = date > maxDate || date < minDate

                    return (
                      <motion.button
                        key={day}
                        onClick={() => !isDisabled && handleDayClick(day)}
                        disabled={isDisabled}
                        className={`aspect-square rounded text-sm font-medium transition ${
                          isSelected
                            ? "bg-primary text-black"
                            : isDisabled
                              ? "text-muted-foreground/40 cursor-not-allowed"
                              : "hover:bg-primary/20"
                        }`}
                        whileHover={!isDisabled ? { scale: 1.1 } : {}}
                        whileTap={!isDisabled ? { scale: 0.9 } : {}}
                      >
                        {day}
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>
            )}

            {/* Close button */}
            <motion.button
              onClick={() => setIsOpen(false)}
              className="w-full mt-4 py-2 bg-primary/20 hover:bg-primary/30 rounded text-sm text-primary transition"
              whileHover={{ scale: 1.02 }}
            >
              Close
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
