"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Edit2, Save, Camera, AlertCircle } from "lucide-react"
import Image from "next/image"
import { useToastSimple } from "@/hooks/use-toast-simple"
import { ToastDisplay } from "@/components/toast-display"

interface AdminProfileProps {
  admin: {
    id: string
    name: string
    email: string
    pic?: string
  }
  onProfileUpdate: (data: any) => void
}

export default function AdminProfile({ admin, onProfileUpdate }: AdminProfileProps) {
  const { toasts, showToast, removeToast } = useToastSimple()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: admin.name || "",
    email: admin.email || "",
    password: "",
    passwordRetype: "",
  })
  const [profilePic, setProfilePic] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>(admin.pic || "/placeholder-user.jpg")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePic(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = async () => {
    // Validate passwords if provided
    if (formData.password || formData.passwordRetype) {
      if (formData.password !== formData.passwordRetype) {
        showToast("Passwords do not match", "error")
        return
      }
      if (formData.password.length < 6) {
        showToast("Password must be at least 6 characters", "error")
        return
      }
    }

    setLoading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("adminId", admin.id)
      formDataToSend.append("name", formData.name)
      formDataToSend.append("email", formData.email)
      
      if (formData.password) {
        formDataToSend.append("password", formData.password)
      }
      
      if (profilePic) {
        formDataToSend.append("pic", profilePic)
      }

      showToast("Updating profile...", "info")

      const response = await fetch(`/api/admin/profile`, {
        method: "PATCH",
        body: formDataToSend,
      })

      const data = await response.json()
      if (data.success) {
        const updatedUser = {
          ...admin,
          name: formData.name,
          email: formData.email,
          pic: data.admin.pic || admin.pic,
        }
        localStorage.setItem("votyUser", JSON.stringify(updatedUser))
        onProfileUpdate(updatedUser)
        setFormData({
          name: formData.name,
          email: formData.email,
          password: "",
          passwordRetype: "",
        })
        setProfilePic(null)
        setIsEditing(false)
        showToast("Profile updated successfully!", "success")
      } else {
        showToast(data.message || "Failed to update profile", "error")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      showToast("Error updating profile", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <ToastDisplay toasts={toasts} onRemove={removeToast} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white mb-2">My Profile</h2>
        <p className="text-muted-foreground">Manage your admin profile and settings</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-card border border-primary/20 rounded-xl p-8 max-w-2xl"
      >
        {/* Profile Picture */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary mb-4">
            <Image
              src={previewUrl}
              alt={formData.name}
              fill
              className="object-cover"
            />
            {isEditing && (
              <label className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/70 transition">
                <Camera className="text-white" size={32} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>
          {!isEditing && (
            <motion.button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit2 size={18} />
              Edit Profile
            </motion.button>
          )}
        </div>

        {/* Form */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 mb-6"
          >
            <div>
              <label className="block text-sm font-medium text-white mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                placeholder="your@email.com"
              />
            </div>

            {/* Password Section */}
            <div className="bg-background/50 border border-primary/10 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                <AlertCircle size={16} className="text-yellow-500" />
                Change Password (Optional)
              </h4>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">New Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                  placeholder="Leave empty to keep current password"
                />
              </div>

              <div className="mt-3">
                <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                <input
                  type="password"
                  name="passwordRetype"
                  value={formData.passwordRetype}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
                  placeholder="Retype password"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <motion.button
                onClick={handleSaveProfile}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-black font-semibold rounded-lg transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Save size={18} />
                {loading ? "Saving..." : "Save Changes"}
              </motion.button>
              <motion.button
                onClick={() => {
                  setIsEditing(false)
                  setFormData({ name: admin.name || "", email: admin.email || "" })
                  setProfilePic(null)
                  setPreviewUrl(admin.pic || "/placeholder-user.jpg")
                }}
                className="flex-1 px-6 py-3 bg-card border border-primary/20 hover:bg-card/80 text-white font-semibold rounded-lg transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Display Info */}
        {!isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <div className="pb-4 border-b border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Full Name</p>
              <p className="text-lg font-semibold text-white">{admin.name || "N/A"}</p>
            </div>
            <div className="pb-4 border-b border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Email Address</p>
              <p className="text-lg font-semibold text-white">{admin.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Admin ID</p>
              <p className="text-lg font-semibold text-primary font-mono">{admin.id}</p>
            </div>
          </motion.div>
        )}
      </motion.div>

      
    </div>
  )
}
