"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Bell, Lock, Upload, Eye, EyeOff, LogOut, User } from "lucide-react"
import Image from "next/image"
import { useSessionUser } from "@/hooks/use-session-user"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onLogout: () => void
}

export default function SettingsModal({ isOpen, onClose, onLogout }: SettingsModalProps) {
  const { user } = useSessionUser()
  const [activeTab, setActiveTab] = useState<"profile" | "notifications" | "password">("profile")
  const [profilePic, setProfilePic] = useState<string | null>(null)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [subscriptionStatus, setSubscriptionStatus] = useState("")
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" })
  const [showPasswords, setShowPasswords] = useState({ old: false, new: false, confirm: false })
  const [passwordChanged, setPasswordChanged] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load user data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      setFullName(user.name || "")
      setEmail(user.email || "")
      setDateOfBirth(user.dateOfBirth || "")
      setSubscriptionStatus(user.isSubscribed ? "Active" : "Inactive")
      // Load profile picture from database if available
      if (user.pic) {
        setProfilePic(user.pic)
      }
      console.log("Settings modal loaded with user:", user)
    }
  }, [isOpen, user])

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setProfilePic(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true)
    try {
      // Get current user data from localStorage to preserve all fields
      const storedUser = localStorage.getItem("votyUser")
      const currentUser = storedUser ? JSON.parse(storedUser) : {}
      
      // Update localStorage with new user data including pic
      const updatedUser = {
        ...currentUser,
        name: fullName,
        email: email,
        pic: profilePic,
        role: "user",
        isSubscribed: subscriptionStatus === "Active",
      }
      
      localStorage.setItem("votyUser", JSON.stringify(updatedUser))

      // Call the API endpoint to persist to database
      try {
        const response = await fetch("/api/auth/update-profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName,
            email,
            profilePic,
            subscription_status: subscriptionStatus,
          }),
        })

        if (!response.ok) {
          console.warn("API update failed, but localStorage was updated")
        } else {
          const responseData = await response.json()
          console.log("Profile updated successfully:", responseData)
        }
      } catch (apiError) {
        console.warn("API update failed, but localStorage was updated:", apiError)
      }

      setUpdateSuccess(true)
      setTimeout(() => setUpdateSuccess(false), 2000)
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setIsUpdatingProfile(false)
    }
  }

  const handlePasswordChange = async () => {
    // Validate inputs
    if (!passwords.old || !passwords.new || !passwords.confirm) {
      alert("Please fill in all password fields")
      return
    }

    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match")
      return
    }

    if (passwords.new.length < 6) {
      alert("New password must be at least 6 characters")
      return
    }

    try {
      // Call the password change endpoint
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          oldPassword: passwords.old,
          newPassword: passwords.new,
        }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setPasswordChanged(true)
        setTimeout(() => {
          setPasswords({ old: "", new: "", confirm: "" })
          setShowPasswordForm(false)
          setPasswordChanged(false)
        }, 2000)
      } else {
        alert(data.error || "Failed to change password")
      }
    } catch (error) {
      console.error("Error changing password:", error)
      alert("An error occurred while changing the password")
    }
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "password", label: "Security", icon: Lock },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-card rounded-xl border border-primary/30 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-primary/30">
              <h2 className="text-xl font-bold text-primary">Settings</h2>
              <button
                onClick={onClose}
                className="text-primary hover:text-primary/80 transition"
                aria-label="Close settings"
              >
                <X size={24} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-primary/20 bg-background/50">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex-1 px-4 py-3 text-white font-medium transition-colors border-b-2 flex items-center justify-center gap-2 ${
                    activeTab === tab.id ? "border-primary text-primary" : "border-transparent hover:text-primary"
                  }`}
                >
                  <tab.icon size={20} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <div className="space-y-4">
                  {updateSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm text-center"
                    >
                      Profile updated successfully!
                    </motion.div>
                  )}

                  <div>
                    <label className="text-sm text-white font-medium mb-2 block">Profile Picture</label>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center overflow-hidden flex-shrink-0">
                        {profilePic ? (
                          <Image
                            src={profilePic}
                            alt="Profile"
                            width={80}
                            height={80}
                            unoptimized
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-2xl">👤</span>
                        )}
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition flex items-center gap-2 font-medium"
                      >
                        <Upload size={16} />
                        Upload
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicUpload}
                        className="hidden"
                        aria-label="Upload profile picture"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-white font-medium mb-2 block">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-2 rounded-lg text-white placeholder-muted-foreground bg-background border border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary transition"
                    />
                  </div>

                  <div>
                    <label className="text-sm text-white font-medium mb-2 block">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full px-4 py-2 rounded-lg text-white placeholder-muted-foreground bg-background border border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary transition"
                    />
                  </div>

                  <div>
                    <p className="text-sm text-white font-medium mb-2">Subscription Status</p>
                    <div className="bg-background p-3 rounded-lg border border-primary/30">
                      <p className="text-primary font-semibold">{subscriptionStatus || "Not specified"}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleUpdateProfile}
                    disabled={isUpdatingProfile}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    {isUpdatingProfile ? "Updating..." : "Update Profile"}
                  </button>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-background border border-primary/20">
                    <div className="flex items-center gap-3">
                      <Bell size={20} className="text-primary" />
                      <div>
                        <p className="text-white font-medium">Email Notifications</p>
                        <p className="text-xs text-muted-foreground">Receive updates via email</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notificationsEnabled ? "bg-primary" : "bg-muted"
                      }`}
                      aria-label="Toggle notifications"
                    >
                      <motion.div
                        className="w-5 h-5 rounded-full bg-white"
                        animate={{ x: notificationsEnabled ? 6 : -6 }}
                      />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    {notificationsEnabled
                      ? "You will receive notifications about quizzes, votes, and new videos."
                      : "Notifications are currently disabled."}
                  </p>
                </div>
              )}

              {/* Password Tab */}
              {activeTab === "password" && (
                <div className="space-y-4">
                  {!showPasswordForm ? (
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="w-full px-4 py-3 rounded-lg bg-primary text-white hover:bg-primary/90 transition font-medium flex items-center gap-2"
                    >
                      <Lock size={18} />
                      Change Password
                    </button>
                  ) : (
                    <div className="space-y-3">
                      {passwordChanged && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm text-center"
                        >
                          Password changed successfully!
                        </motion.div>
                      )}

                      <div>
                        <label className="text-sm text-white font-medium mb-2 block">Current Password</label>
                        <div className="relative">
                          <input
                            type={showPasswords.old ? "text" : "password"}
                            value={passwords.old}
                            onChange={(e) => setPasswords({ ...passwords, old: e.target.value })}
                            placeholder="Enter current password"
                            className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                          <button
                            onClick={() => setShowPasswords({ ...showPasswords, old: !showPasswords.old })}
                            className="absolute right-3 top-2.5 text-primary hover:text-primary/80"
                          >
                            {showPasswords.old ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-white font-medium mb-2 block">New Password</label>
                        <div className="relative">
                          <input
                            type={showPasswords.new ? "text" : "password"}
                            value={passwords.new}
                            onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                            placeholder="Enter new password"
                            className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                          <button
                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                            className="absolute right-3 top-2.5 text-primary hover:text-primary/80"
                          >
                            {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm text-white font-medium mb-2 block">Confirm Password</label>
                        <div className="relative">
                          <input
                            type={showPasswords.confirm ? "text" : "password"}
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                            placeholder="Confirm new password"
                            className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                          />
                          <button
                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                            className="absolute right-3 top-2.5 text-primary hover:text-primary/80"
                          >
                            {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handlePasswordChange}
                          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-medium"
                        >
                          Update Password
                        </button>
                        <button
                          onClick={() => setShowPasswordForm(false)}
                          className="flex-1 px-4 py-2 bg-muted text-white rounded-lg hover:bg-muted/80 transition font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Logout */}
              <motion.button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-3 p-3 rounded-lg bg-destructive/20 hover:bg-destructive/30 transition text-destructive mt-6"
                whileTap={{ scale: 0.95 }}
              >
                <LogOut size={18} />
                <span className="font-medium">Logout</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
