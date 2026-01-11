"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"  
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"
import Header from "@/components/header"
import PhoneInput from "@/components/phone-input"
import DatePicker from "@/components/date-picker"
import { createClient } from "@/lib/supabase/client"
import { useToastSimple } from "@/hooks/use-toast-simple"
import { ToastDisplay } from "@/components/toast-display"

export const dynamic = 'force-dynamic'

export default function SignUp() {
  const router = useRouter()
  const { toasts, showToast, removeToast } = useToastSimple()
  const [supabase, setSupabase] = useState<any>(null)

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    countryCode: "+234",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [verificationCode, setVerificationCode] = useState("")
  const [sentCode, setSentCode] = useState("")
  const [isCodeSent, setIsCodeSent] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setSupabase(createClient())
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handlePhoneChange = (phone: string) => {
    setFormData((prev) => ({ ...prev, phoneNumber: phone }))
  }

  const handleCountryChange = (code: string) => {
    setFormData((prev) => ({ ...prev, countryCode: code }))
  }

  const handleSendCode = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          countryCode: formData.countryCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to send OTP")
      }

      setSentCode("") // Code is sent via SMS, don't expose it
      setIsCodeSent(true)
      alert("Verification code sent to your phone!")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send OTP"
      setError(errorMessage)
      console.error("[v0] Error sending OTP:", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          countryCode: formData.countryCode,
          otp: verificationCode,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify OTP")
      }

      setIsVerified(true)
      alert("Phone number verified successfully!")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Verification failed"
      setError(errorMessage)
      console.error("[v0] Error verifying OTP:", errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNextStep = () => {
    if (formData.fullName && formData.email && formData.phoneNumber && isVerified) {
      setStep(2)
    }
  }

   const handleSignUp = async () => {
  if (formData.dateOfBirth && formData.password && formData.confirmPassword && formData.agreeToTerms) {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // ensure date is sent as YYYY-MM-DD (DB date type)
      const dobISO = formData.dateOfBirth
        ? new Date(formData.dateOfBirth).toISOString().slice(0, 10)
        : null

      // use snake_case keys expected by backend / DB
      const payload = {
        email: formData.email,
        password: formData.password,
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        country_code: formData.countryCode,
        date_of_birth: dobISO,
        agree_to_terms: formData.agreeToTerms,
        phone_verified: isVerified ?? false
      }

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      console.log("[v0] register response:", response.status, data)

      if (!response.ok) {
        const msg = data?.error || data?.message || "Registration failed"
        throw new Error(msg)
      }

      console.log("✅ User registered successfully:", data.user)

      showToast(`Welcome to VOTY, ${formData.fullName}! A verification link has been sent to ${formData.email}. Please verify your email to get started.`, "success")
      
      // ✅ REDIRECT AFTER SUCCESS (after 2 seconds)
      setTimeout(() => {
        setStep(1)
        setFormData({
          fullName: "",
          email: "",
          phoneNumber: "",
          countryCode: "+234",
          dateOfBirth: "",
          password: "",
          confirmPassword: "",
          agreeToTerms: false,
        })
        setVerificationCode("")
        setSentCode("")
        setIsCodeSent(false)
        setIsVerified(false)
        
        // ✅ REDIRECT TO LOGIN PAGE
        router.push("/login")
      }, 2000)  // Changed from 5000 to 2000 (2 seconds) for faster redirect
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Sign up failed"
      setError(errorMessage)
      console.error("[v0] Error signing up:", errorMessage)
    } finally {
      setIsLoading(false)
    }
  } else {
    setError("Missing required fields")
  }
}

  return (
    <main className="bg-black min-h-screen">
      <ToastDisplay toasts={toasts} onRemove={removeToast} />
      <Header isScrolled={isScrolled} />

      <div className="flex items-center justify-center min-h-screen pt-20 pb-10 px-4">
        <motion.div
          className="w-full max-w-md bg-card border border-primary/20 rounded-2xl p-8 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <Link
              href="/"
              className="text-3xl font-bold text-primary hover:text-primary/80 transition-colors mb-4 inline-block"
            >
              VOTY
            </Link>
            <h1 className="text-3xl font-bold text-foreground mt-4">Create Account</h1>
            <p className="text-muted-foreground mt-2">Join the movement of empowered youth</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                  <PhoneInput
                    value={formData.phoneNumber}
                    countryCode={formData.countryCode}
                    onPhoneChange={handlePhoneChange}
                    onCountryChange={handleCountryChange}
                  />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {formData.phoneNumber && (
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={isCodeSent || isLoading}
                      className="w-full py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Sending..." : isCodeSent ? "Code Sent" : "Get Verification Code"}
                    </button>

                    {isCodeSent && !isVerified && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-2"
                      >
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                          className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all text-center text-lg tracking-widest"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyCode}
                          disabled={verificationCode.length !== 6 || isLoading}
                          className="w-full py-2 bg-primary/20 text-primary rounded-lg font-medium hover:bg-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? "Verifying..." : "Verify Code"}
                        </button>
                      </motion.div>
                    )}

                    {isVerified && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 text-green-500 text-sm"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Phone number verified</span>
                      </motion.div>
                    )}
                  </div>
                )}

                <button
                  onClick={handleNextStep}
                  disabled={!formData.fullName || !formData.email || !formData.phoneNumber || !isVerified || isLoading}
                  className="w-full py-3 bg-primary text-black rounded-lg font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-gold-hover"
                >
                  Next
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Date of Birth</label>
                  <DatePicker
                    value={formData.dateOfBirth}
                    onChange={(date) => setFormData((prev) => ({ ...prev, dateOfBirth: date }))}
                    placeholder="Select your date of birth"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter your password"
                      className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-primary hover:text-primary/80 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </motion.button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-primary hover:text-primary/80 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </motion.button>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 bg-background border border-primary/20 rounded cursor-pointer accent-primary"
                  />
                  <label className="text-sm text-muted-foreground">
                    I agree to VOTY's Terms and Conditions <span className="text-destructive">*</span>
                  </label>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  onClick={handleSignUp}
                  disabled={
                    !formData.dateOfBirth ||
                    !formData.password ||
                    !formData.confirmPassword ||
                    !formData.agreeToTerms ||
                    isLoading
                  }
                  className="w-full py-3 bg-primary text-black rounded-lg font-bold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-gold-hover"
                >
                  {isLoading ? "Creating Account..." : "Sign Up"}
                </button>

                <button
                  onClick={() => {
                    setStep(1)
                    setError(null)
                  }}
                  className="w-full py-3 border border-primary text-primary rounded-lg font-bold hover:bg-primary/10 transition-all"
                >
                  Back
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </main>
  )
}
