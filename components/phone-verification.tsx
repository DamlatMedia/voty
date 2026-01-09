"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { COUNTRIES, type Country } from "@/lib/countries"
import { ChevronDown, Phone, Check } from "lucide-react"

interface PhoneVerificationProps {
  onVerificationComplete: (phoneData: { country: Country; phoneNumber: string; verificationCode: string }) => void
  onBack: () => void
}

export function PhoneVerification({ onVerificationComplete, onBack }: PhoneVerificationProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]) // Nigeria by default
  const [phoneNumber, setPhoneNumber] = useState("")
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [step, setStep] = useState<"input" | "verification">("input")
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [countrySearchTerm, setCountrySearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredCountries = COUNTRIES.filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearchTerm.toLowerCase()) ||
      country.dialCode.includes(countrySearchTerm),
  )

  const handleSendCode = async () => {
    if (!phoneNumber.trim()) return

    setIsLoading(true)
    // Simulate API call to send verification code
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)
    setStep("verification")
  }

  const handleVerifyCode = async () => {
    if (!verificationCode.trim() || verificationCode.length < 4) return

    setIsLoading(true)
    // Simulate API call to verify code
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsLoading(false)

    onVerificationComplete({
      country: selectedCountry,
      phoneNumber: `${selectedCountry.dialCode}${phoneNumber}`,
      verificationCode,
    })
  }

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "") // Remove non-digits
    setPhoneNumber(value)
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {step === "input" ? (
        <>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
            <div className="flex gap-3">
              {/* Country Selector */}
              <div className="relative w-32" ref={dropdownRef}>
                <button
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  className="w-full px-3 py-3 bg-background border border-primary/20 rounded-lg text-foreground hover:border-primary/40 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all flex items-center justify-between gap-2"
                >
                  <span className="text-xl">{selectedCountry.flag}</span>
                  <ChevronDown className="w-4 h-4 text-primary" />
                </button>

                <AnimatePresence>
                  {showCountryDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-card border border-primary/20 rounded-lg max-h-48 overflow-y-auto z-50 shadow-lg"
                    >
                      <input
                        type="text"
                        placeholder="Search countries..."
                        value={countrySearchTerm}
                        onChange={(e) => setCountrySearchTerm(e.target.value)}
                        className="w-full px-3 py-2 bg-background border-b border-primary/20 text-foreground placeholder-muted-foreground focus:outline-none sticky top-0"
                      />
                      {filteredCountries.map((country) => (
                        <button
                          key={country.code}
                          onClick={() => {
                            setSelectedCountry(country)
                            setShowCountryDropdown(false)
                            setCountrySearchTerm("")
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-primary/10 transition-colors flex items-center gap-3 border-b border-primary/10 last:border-b-0"
                        >
                          <span className="text-xl">{country.flag}</span>
                          <div>
                            <div className="text-sm text-foreground">{country.name}</div>
                            <div className="text-xs text-muted-foreground">{country.dialCode}</div>
                          </div>
                          {selectedCountry.code === country.code && <Check className="w-4 h-4 text-primary ml-auto" />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Phone Input */}
              <div className="flex-1">
                <div className="flex items-center bg-background border border-primary/20 rounded-lg px-3 py-3 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/30 transition-all">
                  <span className="text-foreground font-medium mr-2">{selectedCountry.dialCode}</span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneInput}
                    placeholder="Enter phone number"
                    className="flex-1 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Enter your phone number without the country code</p>
          </div>

          <button
            onClick={handleSendCode}
            disabled={!phoneNumber.trim() || isLoading}
            className="w-full py-3 bg-primary text-black rounded-lg font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-gold-hover flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            {isLoading ? "Sending..." : "Get Verification Code"}
          </button>
        </>
      ) : (
        <>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Verification Code</label>
            <p className="text-sm text-muted-foreground mb-3">
              Enter the 6-digit code sent to {selectedCountry.dialCode}
              {phoneNumber}
            </p>
            <input
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="000000"
              className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all text-center tracking-widest"
            />
          </div>

          <button
            onClick={handleVerifyCode}
            disabled={verificationCode.length < 6 || isLoading}
            className="w-full py-3 bg-primary text-black rounded-lg font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-gold-hover flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            {isLoading ? "Verifying..." : "Verify Code"}
          </button>

          <button
            onClick={() => {
              setStep("input")
              setVerificationCode("")
            }}
            className="w-full py-3 border border-primary/20 text-foreground rounded-lg font-bold hover:bg-primary/10 transition-all"
          >
            Change Phone Number
          </button>
        </>
      )}

      <button
        onClick={onBack}
        className="w-full py-3 border border-primary text-primary rounded-lg font-bold hover:bg-primary/10 transition-all"
      >
        Back
      </button>
    </motion.div>
  )
}
