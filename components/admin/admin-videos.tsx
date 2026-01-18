"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Trash2, Edit2, CheckCircle, XCircle, Upload, Eye, PlayCircle, Clock, HelpCircle } from "lucide-react"
import Image from "next/image"
import { useToastSimple } from "@/hooks/use-toast-simple"
import { ToastDisplay } from "@/components/toast-display"
import { createClient } from "@/lib/supabase/client"

interface Video {
  id: string
  title: string
  description?: string
  category?: string
  video_url: string
  thumbnail_url?: string
  uploader_name?: string
  view_count: number
  vote_count: number
  created_at: string
}

interface AdminVideosProps {
  adminId: string
}

export default function AdminVideos({ adminId }: AdminVideosProps) {
  const { toasts, showToast, removeToast } = useToastSimple()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<Record<string, any>>({})
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadData, setUploadData] = useState({
    title: "",
    description: "",
    category: "",
    video_url: "",
    thumbnail_url: "",
  })
  const [uploadFiles, setUploadFiles] = useState({
    video: null as File | null,
    thumbnail: null as File | null,
  })
  const [uploadMode, setUploadMode] = useState<"url" | "file">("url")
  const [uploadLoading, setUploadLoading] = useState(false)
  const [triviaEditingId, setTriviaEditingId] = useState<string | null>(null)
  const [videoTrivia, setVideoTrivia] = useState<Record<string, any[]>>({})
  const [availableTrivia, setAvailableTrivia] = useState<any[]>([])
  const [triviaLoading, setTriviaLoading] = useState(false)
  const [selectedUploadTrivia, setSelectedUploadTrivia] = useState<string[]>([])
  const [editingTriviaId, setEditingTriviaId] = useState<string | null>(null)

  useEffect(() => {
    fetchVideos()
    fetchAvailableTrivia()
  }, [])

  const fetchAvailableTrivia = async () => {
    try {
      const response = await fetch("/api/trivia")
      const data = await response.json()
      if (data.success) {
        setAvailableTrivia(data.questions || [])
      }
    } catch (error) {
      console.error("Error fetching trivia:", error)
    }
  }

  const fetchVideoTrivia = async (videoId: string) => {
    try {
      setTriviaLoading(true)
      const response = await fetch(`/api/admin/video-trivia?videoId=${videoId}`)
      const data = await response.json()
      if (data.success) {
        setVideoTrivia({
          ...videoTrivia,
          [videoId]: data.questions || [],
        })
      }
    } catch (error) {
      console.error("Error fetching video trivia:", error)
    } finally {
      setTriviaLoading(false)
    }
  }

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/videos")
      const data = await response.json()
      if (data.success) {
        setVideos(data.videos || [])
      }
    } catch (error) {
      console.error("Error fetching videos:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredVideos = videos.filter((video) => {
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  const startEdit = (video: Video) => {
    setEditingId(video.id)
    setEditingTriviaId(video.id)
    setEditData({
      title: video.title,
      description: video.description || "",
      category: video.category || "",
    })
    // Fetch existing trivia for this video
    fetchVideoTrivia(video.id)
  }

  // Direct Supabase upload to bypass Vercel's 4.5MB limit
  const uploadToSupabase = async (file: File, bucket: string) => {
    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${bucket}-${Date.now()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        throw new Error(error.message)
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      return urlData.publicUrl
    } catch (error) {
      console.error(`Error uploading to ${bucket}:`, error)
      throw error
    }
  }

  const handleUploadVideo = async () => {
    if (uploadMode === "url") {
      if (!uploadData.title || !uploadData.video_url) {
        showToast("Please fill in title and video URL", "error")
        return
      }
    } else {
      if (!uploadData.title || !uploadFiles.video) {
        showToast("Please fill in title and select a video file", "error")
        return
      }
    }

    setUploadLoading(true)
    try {
      let video_url = uploadData.video_url
      let thumbnail_url = uploadData.thumbnail_url

      // Upload files to Supabase Storage if in file mode
      if (uploadMode === "file") {
        if (uploadFiles.video) {
          showToast("Uploading video file to storage...", "info")
          try {
            video_url = await uploadToSupabase(uploadFiles.video, "videos")
          } catch (error) {
            showToast("Failed to upload video: " + (error instanceof Error ? error.message : "Unknown error"), "error")
            setUploadLoading(false)
            return
          }
        }

        if (uploadFiles.thumbnail) {
          showToast("Uploading thumbnail to storage...", "info")
          try {
            thumbnail_url = await uploadToSupabase(uploadFiles.thumbnail, "thumbnails")
          } catch (error) {
            console.error("Thumbnail upload failed:", error)
            // Don't fail the whole upload if thumbnail fails
            showToast("Warning: Thumbnail upload failed, but video will be uploaded", "warning")
          }
        }
        }
      }

      showToast("Creating video record...", "info")

      const response = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: uploadData.title,
          description: uploadData.description,
          category: uploadData.category,
          video_url,
          thumbnail_url,
          uploaded_by: adminId,
          uploader_name: "Admin",
          status: "pending",
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Link trivia if any selected
        if (selectedUploadTrivia.length > 0) {
          await handleLinkTrivia(data.video.id, selectedUploadTrivia)
        }

        setVideos([data.video, ...videos])
        setShowUploadModal(false)
        setUploadData({
          title: "",
          description: "",
          category: "",
          video_url: "",
          thumbnail_url: "",
        })
        setUploadFiles({ video: null, thumbnail: null })
        setUploadMode("url")
        setSelectedUploadTrivia([])
        showToast("Video uploaded successfully!", "success")
      } else {
        showToast(data.message || "Failed to upload video", "error")
      }
    } catch (error) {
      console.error("Error uploading video:", error)
      showToast("Error uploading video. Please try again.", "error")
    } finally {
      setUploadLoading(false)
    }
  }

  const handleSaveEdit = async (videoId: string) => {
    if (!editData.title || !editData.title.trim()) {
      showToast("Please enter a title", "error")
      return
    }

    if (!editData.category || !editData.category.trim()) {
      showToast("Please enter a category", "error")
      return
    }

    setActionLoading(videoId)
    try {
      // Only send the fields we want to update
      const updatePayload = {
        title: editData.title.trim(),
        description: editData.description?.trim() || "",
        category: editData.category.trim(),
      }
      
      console.log("Sending update payload:", updatePayload)

      const response = await fetch(`/api/admin/videos/${videoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      })

      const data = await response.json()
      console.log("Update response:", data)
      
      if (data.success) {
        setVideos(videos.map((v) => (v.id === videoId ? { ...v, ...updatePayload } : v)))
        setEditingId(null)
        setEditData({})
        showToast("Video updated successfully!", "success")
      } else {
        console.error("Update failed:", data.message)
        showToast(data.message || "Failed to update video", "error")
      }
    } catch (error) {
      console.error("Error updating video:", error)
      showToast("Error updating video: " + (error instanceof Error ? error.message : "Unknown error"), "error")
    } finally {
      setActionLoading(null)
    }
  }



  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm("Are you sure you want to delete this video? This action cannot be undone.")) return

    setActionLoading(videoId)
    try {
      const response = await fetch(`/api/admin/videos/${videoId}`, {
        method: "DELETE",
      })

      const data = await response.json()
      if (data.success) {
        setVideos(videos.filter((v) => v.id !== videoId))
        showToast("Video deleted successfully!", "success")
      } else {
        showToast("Failed to delete video", "error")
      }
    } catch (error) {
      console.error("Error deleting video:", error)
      showToast("Error deleting video", "error")
    } finally {
      setActionLoading(null)
    }
  }

  const handleLinkTrivia = async (videoId: string, triviaIds: string[]) => {
    try {
      setActionLoading(videoId)
      const response = await fetch("/api/admin/video-trivia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoId,
          trivia_question_ids: triviaIds,
        }),
      })

      const data = await response.json()
      if (data.success) {
        await fetchVideoTrivia(videoId)
        showToast("Trivia linked successfully!", "success")
      } else {
        showToast(data.message || "Failed to link trivia", "error")
      }
    } catch (error) {
      console.error("Error linking trivia:", error)
      showToast("Error linking trivia", "error")
    } finally {
      setActionLoading(null)
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingTriviaId(null)
    setEditData({})
  }

  return (
    <div className="space-y-6">
      <ToastDisplay toasts={toasts} onRemove={removeToast} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-white mb-2">Manage Videos</h2>
        <p className="text-muted-foreground">Upload, review, and manage video content</p>
      </motion.div>

      {/* Filter & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Search videos by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-card border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>

        <motion.button
          onClick={() => setShowUploadModal(true)}
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-black font-semibold rounded-lg transition flex items-center gap-2 whitespace-nowrap"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Upload size={18} />
          <span className="hidden sm:inline">Upload Video</span>
        </motion.button>
      </motion.div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-primary/20 rounded-xl p-6 max-w-2xl w-full max-h-screen overflow-y-auto"
            >
              <h3 className="text-2xl font-bold text-white mb-4">Upload New Video</h3>
              
              {/* Upload Mode Tabs */}
              <div className="flex gap-2 mb-6">
                <motion.button
                  onClick={() => setUploadMode("url")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    uploadMode === "url"
                      ? "bg-primary text-black"
                      : "bg-card border border-primary/20 text-white hover:bg-card/80"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  From URL
                </motion.button>
                <motion.button
                  onClick={() => setUploadMode("file")}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    uploadMode === "file"
                      ? "bg-primary text-black"
                      : "bg-card border border-primary/20 text-white hover:bg-card/80"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  From Device
                </motion.button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Video Title *</label>
                  <input
                    type="text"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                    placeholder="Enter video title"
                    className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Description</label>
                  <textarea
                    value={uploadData.description}
                    onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
                    placeholder="Enter video description"
                    rows={3}
                    className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Category</label>
                  <input
                    type="text"
                    value={uploadData.category}
                    onChange={(e) => setUploadData({ ...uploadData, category: e.target.value })}
                    placeholder="e.g., Moral Stories, Educational, Trending"
                    className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                {/* URL Input Mode */}
                {uploadMode === "url" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Thumbnail URL</label>
                      <input
                        type="text"
                        value={uploadData.thumbnail_url}
                        onChange={(e) => setUploadData({ ...uploadData, thumbnail_url: e.target.value })}
                        placeholder="Image URL"
                        className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Video URL *</label>
                      <input
                        type="text"
                        value={uploadData.video_url}
                        onChange={(e) => setUploadData({ ...uploadData, video_url: e.target.value })}
                        placeholder="Video URL (YouTube, Vimeo, or direct link)"
                        className="w-full px-4 py-2 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary"
                      />
                    </div>
                  </>
                )}

                {/* File Upload Mode */}
                {uploadMode === "file" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Video File *</label>
                      <div className="relative border-2 border-dashed border-primary/30 rounded-lg p-6 hover:border-primary/60 transition cursor-pointer">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setUploadFiles({ ...uploadFiles, video: file })
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-center">
                          <Upload className="mx-auto mb-2 text-primary/60" size={32} />
                          <p className="text-white font-medium">
                            {uploadFiles.video?.name || "Click to select video file"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">Supported: MP4, WebM, OGG, etc.</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">Thumbnail Image</label>
                      <div className="relative border-2 border-dashed border-primary/30 rounded-lg p-6 hover:border-primary/60 transition cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              setUploadFiles({ ...uploadFiles, thumbnail: file })
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-center">
                          <Upload className="mx-auto mb-2 text-primary/60" size={32} />
                          <p className="text-white font-medium">
                            {uploadFiles.thumbnail?.name || "Click to select thumbnail image"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">Supported: JPG, PNG, WebP, etc.</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Trivia Questions Selection */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Link Trivia Questions (Optional)</label>
                  <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-background border border-primary/20 rounded-lg">
                    {availableTrivia.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-4">No trivia questions available. Create some in the Trivia section first.</p>
                    ) : (
                      availableTrivia.map((question) => (
                        <label
                          key={question.id}
                          className="flex items-start gap-2 p-2 rounded hover:bg-primary/10 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedUploadTrivia.includes(question.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUploadTrivia([...selectedUploadTrivia, question.id])
                              } else {
                                setSelectedUploadTrivia(selectedUploadTrivia.filter(id => id !== question.id))
                              }
                            }}
                            className="mt-1 rounded border-primary/20 text-primary cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">{question.question}</p>
                            <p className="text-xs text-muted-foreground">
                              {question.category || "general"} • {question.difficulty || "medium"}
                            </p>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    onClick={handleUploadVideo}
                    disabled={uploadLoading}
                    className="flex-1 px-6 py-2 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-black font-semibold rounded-lg transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {uploadLoading ? "Uploading..." : "Upload Video"}
                  </motion.button>
                  <motion.button
                    onClick={() => setShowUploadModal(false)}
                    className="flex-1 px-6 py-2 bg-card border border-primary/20 hover:bg-card/80 text-white font-semibold rounded-lg transition"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Cancel
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Videos Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full"
          />
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-card border border-primary/20 rounded-xl overflow-hidden hover:border-primary/40 transition"
              >
                <div className="flex flex-col md:flex-row gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="md:w-48 h-32 md:h-auto relative rounded-lg overflow-hidden bg-black/50 flex-shrink-0">
                    {video.thumbnail_url ? (
                      <Image
                        src={video.thumbnail_url}
                        alt={video.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <PlayCircle className="text-primary/50" size={40} />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    {editingId === video.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editData.title}
                          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                          className="w-full px-3 py-2 bg-background border border-primary/20 rounded-lg text-white text-lg font-bold focus:outline-none focus:border-primary"
                        />
                        <textarea
                          value={editData.description}
                          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                          rows={2}
                          className="w-full px-3 py-2 bg-background border border-primary/20 rounded-lg text-white text-sm focus:outline-none focus:border-primary"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={editData.category}
                            onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                            placeholder="e.g., Moral Stories, Educational"
                            className="px-3 py-1 bg-background border border-primary/20 rounded text-white text-sm placeholder-muted-foreground focus:outline-none focus:border-primary"
                          />
                        </div>

                        {/* Trivia Selection in Edit Mode */}
                        <div>
                          <label className="block text-xs font-medium text-white mb-2">Linked Trivia Questions</label>
                          <div className="max-h-32 overflow-y-auto space-y-1 p-2 bg-background border border-primary/20 rounded text-xs">
                            {availableTrivia.length === 0 ? (
                              <p className="text-muted-foreground">No trivia available</p>
                            ) : (
                              availableTrivia.map((question) => {
                                const isLinked = videoTrivia[video.id]?.some(q => q.id === question.id)
                                return (
                                  <label key={question.id} className="flex items-start gap-2 cursor-pointer hover:bg-primary/10 p-1 rounded">
                                    <input
                                      type="checkbox"
                                      checked={isLinked}
                                      onChange={(e) => {
                                        let updatedIds = (videoTrivia[video.id] || []).map(q => q.id)
                                        if (e.target.checked) {
                                          updatedIds.push(question.id)
                                        } else {
                                          updatedIds = updatedIds.filter(id => id !== question.id)
                                        }
                                        handleLinkTrivia(video.id, updatedIds)
                                      }}
                                      className="mt-0.5"
                                    />
                                    <span className="text-white truncate flex-1">{question.question.substring(0, 40)}...</span>
                                  </label>
                                )
                              })
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-bold text-white mb-1">{video.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{video.description}</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400">
                            {video.category || "general"}
                          </span>
                        </div>
                        <div className="flex gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye size={14} />
                            <span>{video.view_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle size={14} />
                            <span>{video.vote_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock size={14} />
                            <span>{new Date(video.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {editingId === video.id ? (
                      <>
                        <motion.button
                          onClick={() => handleSaveEdit(video.id)}
                          disabled={actionLoading === video.id}
                          className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition disabled:opacity-50"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title="Save"
                        >
                          <CheckCircle size={18} />
                        </motion.button>
                        <motion.button
                          onClick={cancelEdit}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title="Cancel"
                        >
                          <XCircle size={18} />
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <motion.button
                          onClick={() => startEdit(video)}
                          className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            if (!videoTrivia[video.id]) {
                              fetchVideoTrivia(video.id)
                            }
                            setTriviaEditingId(triviaEditingId === video.id ? null : video.id)
                          }}
                          className="p-2 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title="Manage Trivia"
                        >
                          <HelpCircle size={18} />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteVideo(video.id)}
                          disabled={actionLoading === video.id}
                          className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition disabled:opacity-50"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </>
                    )}
                  </div>
                </div>

                {/* Trivia Management Section */}
                {triviaEditingId === video.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-card border-t border-primary/10 p-4 space-y-4"
                  >
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-3">Link Trivia Questions</h4>
                      {triviaLoading ? (
                        <div className="flex justify-center py-4">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full"
                          />
                        </div>
                      ) : (
                        <div className="max-h-96 overflow-y-auto space-y-2">
                          {availableTrivia.length === 0 ? (
                            <p className="text-xs text-muted-foreground">No trivia questions available. Create some first.</p>
                          ) : (
                            availableTrivia.map((question) => {
                              const isLinked = videoTrivia[video.id]?.some(q => q.id === question.id)
                              return (
                                <motion.label
                                  key={question.id}
                                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-primary/10 cursor-pointer transition"
                                  whileHover={{ x: 4 }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isLinked}
                                    onChange={(e) => {
                                      let updatedIds = (videoTrivia[video.id] || []).map(q => q.id)
                                      if (e.target.checked) {
                                        updatedIds.push(question.id)
                                      } else {
                                        updatedIds = updatedIds.filter(id => id !== question.id)
                                      }
                                      handleLinkTrivia(video.id, updatedIds)
                                    }}
                                    className="mt-1 rounded border-primary/20 text-primary cursor-pointer"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-white truncate">{question.question}</p>
                                    <p className="text-xs text-muted-foreground">
                                      Category: {question.category || "general"} • Difficulty: {question.difficulty || "medium"}
                                    </p>
                                  </div>
                                </motion.label>
                              )
                            })
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {filteredVideos.length === 0 && !loading && (
        <div className="text-center py-12">
          <PlayCircle className="mx-auto text-primary/30 mb-4" size={48} />
          <p className="text-muted-foreground">No videos found</p>
        </div>
      )}
    </div>
  )
}
