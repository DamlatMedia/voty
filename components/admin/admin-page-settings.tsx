"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Settings, Upload, Type, Link as LinkIcon, Image as ImageIcon, Palette } from "lucide-react"
import Image from "next/image"
import { useToastSimple } from "@/hooks/use-toast-simple"
import { ToastDisplay } from "@/components/toast-display"

interface PageSettingsProps {
  adminId: string
}

interface PageConfig {
  // Branding
  siteName: string
  brandName: string
  brandTagline: string
  siteImage: string | null
  siteImageFile: File | null
  primaryColor: string

  // Hero Section
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  heroImage: string | null
  heroImageFile: File | null

  // Features Section
  featuresTitle: string
  featuresList: Array<{ title: string; description: string; image?: string; imageFile?: File }>

  // Footer
  footerBrandText: string
  footerAbout: string
  footerContactEmail: string
  footerContactPhone: string
  footerContactLocation: string | null
  footerText: string

  // Social Media
  socialFacebook: string | null
  socialTwitter: string | null
  socialInstagram: string | null
  socialYouTube: string | null

  // General/SEO
  siteTitle: string
  siteDescription: string

  // Legal
  privacyPolicyContent: string | null
  termsOfServiceContent: string | null
}

export default function PageSettings({ adminId }: PageSettingsProps) {
  const { toasts, showToast, removeToast } = useToastSimple()
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState<"branding" | "hero" | "features" | "footer" | "social" | "legal" | "general">("branding")
  const [previewUrls, setPreviewUrls] = useState({
    siteImage: "",
    heroImage: "",
  })

  const [config, setConfig] = useState<PageConfig>({
    // Branding
    siteName: '',
    brandName: '',
    brandTagline: '',
    siteImage: null,
    siteImageFile: null,
    primaryColor: '',

    // Hero Section
    heroTitle: '',
    heroSubtitle: '',
    heroDescription: '',
    heroImage: null,
    heroImageFile: null,

    // Features Section
    featuresTitle: '',
    featuresList: [],

    // Footer
    footerBrandText: '',
    footerAbout: '',
    footerContactEmail: '',
    footerContactPhone: '',
    footerContactLocation: null,
    footerText: '',

    // Social Media
    socialFacebook: null,
    socialTwitter: null,
    socialInstagram: null,
    socialYouTube: null,

    // General/SEO
    siteTitle: '',
    siteDescription: '',

    // Legal
    privacyPolicyContent: null,
    termsOfServiceContent: null,
  })

  // Load settings from database on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/page-settings')
        const data = await response.json()
        if (data.success && data.config) {
          const settings = data.config
          setConfig((prev) => ({
            ...prev,
            siteName: settings.site_name || prev.siteName,
            brandName: settings.brand_name || prev.brandName,
            brandTagline: settings.brand_tagline || prev.brandTagline,
            siteImage: settings.site_image || prev.siteImage,
            primaryColor: settings.primary_color || prev.primaryColor,
            heroTitle: settings.hero_title || prev.heroTitle,
            heroSubtitle: settings.hero_subtitle || prev.heroSubtitle,
            heroDescription: settings.hero_description || prev.heroDescription,
            heroImage: settings.hero_image || prev.heroImage,
            featuresTitle: settings.features_title || prev.featuresTitle,
            featuresList: (settings.features_list || []).map((f: any) => ({
              title: f.title || '',
              description: f.description || '',
              image: f.image || undefined,
              imageFile: undefined
            })),
            footerBrandText: settings.footer_brand_text || prev.footerBrandText,
            footerAbout: settings.footer_about || prev.footerAbout,
            footerContactEmail: settings.footer_contact_email || prev.footerContactEmail,
            footerContactPhone: settings.footer_contact_phone || prev.footerContactPhone,
            footerContactLocation: settings.footer_contact_location || prev.footerContactLocation,
            footerText: settings.footer_text || prev.footerText,
            siteTitle: settings.site_title || prev.siteTitle,
            siteDescription: settings.site_description || prev.siteDescription,
            socialFacebook: settings.social_facebook || prev.socialFacebook,
            socialTwitter: settings.social_twitter || prev.socialTwitter,
            socialInstagram: settings.social_instagram || prev.socialInstagram,
            socialYouTube: settings.social_youtube || prev.socialYouTube,
            privacyPolicyContent: settings.privacy_policy_content || prev.privacyPolicyContent,
            termsOfServiceContent: settings.terms_of_service_content || prev.termsOfServiceContent,
          }))
          if (settings.site_image) {
            setPreviewUrls((prev) => ({ ...prev, siteImage: settings.site_image }))
          }
          if (settings.hero_image) {
            setPreviewUrls((prev) => ({ ...prev, heroImage: settings.hero_image }))
          }
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }
    loadSettings()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setConfig((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, field: "siteImageFile" | "heroImageFile") => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrls((prev) => ({
          ...prev,
          [field === "siteImageFile" ? "siteImage" : "heroImage"]: reader.result as string,
        }))
      }
      reader.readAsDataURL(file)
      setConfig((prev) => ({
        ...prev,
        [field]: file,
      }))
    }
  }

  const handleSaveSettings = async () => {
    setLoading(true)
    try {
      showToast("Saving page settings...", "info")

      // Handle feature images - upload them and get URLs
      const featuresWithUrls = await Promise.all(
        config.featuresList.map(async (feature, index) => {
          const featureData: any = {
            title: feature.title || '',
            description: feature.description || ''
          }
          
          // If there's a new image file, upload it
          if (feature.imageFile) {
            const featureFormData = new FormData()
            featureFormData.append("file", feature.imageFile)
            featureFormData.append("type", "feature")
            
            try {
              const uploadResponse = await fetch("/api/admin/upload", {
                method: "POST",
                body: featureFormData,
              })
              const uploadData = await uploadResponse.json()
              if (uploadData.success && uploadData.url) {
                featureData.image = uploadData.url
              }
            } catch (error) {
              console.error(`Error uploading feature ${index} image:`, error)
            }
          } else if (feature.image && typeof feature.image === 'string') {
            // Keep existing image URL
            featureData.image = feature.image
          }
          
          return featureData
        })
      )
      
      const formData = new FormData()
      formData.append("adminId", adminId)
      
      // Create clean config object without File objects
      const cleanConfig = {
        siteName: config.siteName,
        brandName: config.brandName,
        brandTagline: config.brandTagline,
        siteImage: config.siteImage,
        primaryColor: config.primaryColor,
        heroTitle: config.heroTitle,
        heroSubtitle: config.heroSubtitle,
        heroDescription: config.heroDescription,
        heroImage: config.heroImage,
        featuresTitle: config.featuresTitle,
        featuresList: featuresWithUrls,
        footerBrandText: config.footerBrandText,
        footerAbout: config.footerAbout,
        footerContactEmail: config.footerContactEmail,
        footerContactPhone: config.footerContactPhone,
        footerContactLocation: config.footerContactLocation,
        footerText: config.footerText,
        siteTitle: config.siteTitle,
        siteDescription: config.siteDescription,
        socialFacebook: config.socialFacebook,
        socialTwitter: config.socialTwitter,
        socialInstagram: config.socialInstagram,
        socialYouTube: config.socialYouTube,
        privacyPolicyContent: config.privacyPolicyContent,
        termsOfServiceContent: config.termsOfServiceContent,
      }
      
      formData.append("config", JSON.stringify(cleanConfig))

      if (config.siteImageFile) {
        formData.append("siteImage", config.siteImageFile)
      }
      if (config.heroImageFile) {
        formData.append("heroImage", config.heroImageFile)
      }

      const response = await fetch("/api/admin/page-settings", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      if (data.success) {
        showToast("Page settings saved successfully!", "success")
      } else {
        showToast(data.message || "Failed to save settings", "error")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      showToast("Error saving page settings", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <ToastDisplay toasts={toasts} onRemove={removeToast} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
          <Settings size={28} className="text-primary" />
          Page Settings
        </h2>
        <p className="text-muted-foreground">Manage website content, branding, and page configurations</p>
      </motion.div>

      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-primary/20 pb-4">
        {[
          { id: "branding" as const, label: "Branding & Logo", icon: Palette },
          { id: "hero" as const, label: "Hero Section", icon: ImageIcon },
          { id: "features" as const, label: "Features", icon: Type },
          { id: "footer" as const, label: "Footer", icon: LinkIcon },
          { id: "social" as const, label: "Social Media", icon: Settings },
          { id: "legal" as const, label: "Legal", icon: Type },
          // { id: "general" as const, label: "General", icon: Settings },
        ].map((section) => (
          <motion.button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
              activeSection === section.id
                ? "bg-primary text-black"
                : "bg-card border border-primary/20 text-white hover:border-primary/40"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <section.icon size={18} />
            {section.label}
          </motion.button>
        ))}
      </div>

      {/* Branding Section */}
      {activeSection === "branding" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-primary/20 rounded-xl p-6 space-y-6">
          <h3 className="text-2xl font-bold text-white">Branding & Logo</h3>

          {/* Site Logo */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-white">Site Image</label>
            <div className="flex gap-6 items-start">
              <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-primary/30 bg-background flex items-center justify-center">
                {previewUrls.siteImage ? (
                  <Image src={previewUrls.siteImage} alt="Site Image" width={96} height={96} className="object-cover" />
                ) : (
                  <span className="text-muted-foreground text-sm">No image</span>
                )}
              </div>
              <div className="flex-1">
                <label className="relative border-2 border-dashed border-primary/30 rounded-lg p-6 cursor-pointer hover:border-primary/60 transition">
                  <div className="text-center">
                    <Upload className="mx-auto mb-2 text-primary/60" size={32} />
                    <p className="text-white font-medium">Click to upload image</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "siteImageFile")}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Brand Name & Tagline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Brand Name</label>
              <input
                type="text"
                name="brandName"
                value={config.brandName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                placeholder="e.g., VOTY"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Brand Tagline</label>
              <input
                type="text"
                name="brandTagline"
                value={config.brandTagline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                placeholder="e.g., Voice of the Youth"
              />
            </div>
          </div>

          {/* Primary Color */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Primary Brand Color</label>
            <div className="flex gap-4 items-center">
              <input
                type="color"
                name="primaryColor"
                value={config.primaryColor}
                onChange={handleInputChange}
                className="w-20 h-20 rounded-lg cursor-pointer"
              />
              <div>
                <p className="text-white font-medium">{config.primaryColor}</p>
                <p className="text-xs text-muted-foreground">Used for buttons, links, and accents</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hero Section */}
      {activeSection === "hero" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-primary/20 rounded-xl p-6 space-y-6">
          <h3 className="text-2xl font-bold text-white">Hero Section</h3>

          {/* Hero Image */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-white">Hero Background Image</label>
            <div className="flex gap-6 items-start">
              <div className="w-32 h-24 rounded-lg overflow-hidden border-2 border-primary/30 bg-background flex items-center justify-center">
                {previewUrls.heroImage ? (
                  <Image src={previewUrls.heroImage} alt="Hero" width={128} height={96} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-muted-foreground text-sm">No image</span>
                )}
              </div>
              <div className="flex-1">
                <label className="relative border-2 border-dashed border-primary/30 rounded-lg p-6 cursor-pointer hover:border-primary/60 transition">
                  <div className="text-center">
                    <Upload className="mx-auto mb-2 text-primary/60" size={32} />
                    <p className="text-white font-medium">Click to upload image</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, "heroImageFile")}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Hero Text */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Hero Title (Main Heading)</label>
            <input
              type="text"
              name="heroTitle"
              value={config.heroTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 mb-4"
              placeholder="Main heading on hero section"
            />

            <label className="block text-sm font-medium text-white mb-2">Hero Subtitle</label>
            <input
              type="text"
              name="heroSubtitle"
              value={config.heroSubtitle}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 mb-4"
              placeholder="Subtitle text"
            />

            <label className="block text-sm font-medium text-white mb-2">Hero Description</label>
            <textarea
              name="heroDescription"
              value={config.heroDescription}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="Hero description text"
            />
          </div>
        </motion.div>
      )}

      {/* Features Section */}
      {activeSection === "features" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-primary/20 rounded-xl p-6 space-y-6">
          <h3 className="text-2xl font-bold text-white">Features Section</h3>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Features Title</label>
            <input
              type="text"
              name="featuresTitle"
              value={config.featuresTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="Section title"
            />
          </div>

          <div className="bg-background/50 rounded-lg p-4 border border-primary/10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-white font-medium">Feature Items ({config.featuresList.length})</p>
              <button
                onClick={() => {
                  setConfig((prev) => ({
                    ...prev,
                    featuresList: [...prev.featuresList, { title: '', description: '', icon: '⭐', image: undefined }]
                  }))
                }}
                className="px-3 py-1 text-sm bg-primary hover:bg-primary/90 text-black font-semibold rounded transition"
              >
                + Add Feature
              </button>
            </div>
            
            {config.featuresList.length === 0 ? (
              <p className="text-muted-foreground text-sm mb-4">No features added yet. Click "Add Feature" to create one.</p>
            ) : null}
            
            {config.featuresList.map((feature, index) => (
              <div key={index} className="mb-4 pb-4 border-b border-primary/10 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-primary">Feature {index + 1}</label>
                  <button
                    onClick={() => {
                      setConfig((prev) => ({
                        ...prev,
                        featuresList: prev.featuresList.filter((_, i) => i !== index)
                      }))
                    }}
                    className="text-xs text-red-500 hover:text-red-400 transition"
                  >
                    Remove
                  </button>
                </div>
                <input
                  type="text"
                  value={feature.title}
                  onChange={(e) => {
                    const newList = [...config.featuresList]
                    newList[index].title = e.target.value
                    setConfig((prev) => ({ ...prev, featuresList: newList }))
                  }}
                  placeholder="Feature title (e.g., Quality Education)"
                  className="w-full px-3 py-2 bg-background border border-primary/20 rounded text-white text-sm mb-2"
                />
                <textarea
                  value={feature.description}
                  onChange={(e) => {
                    const newList = [...config.featuresList]
                    newList[index].description = e.target.value
                    setConfig((prev) => ({ ...prev, featuresList: newList }))
                  }}
                  placeholder="Feature description (e.g., Access to world-class learning resources)"
                  rows={2}
                  className="w-full px-3 py-2 bg-background border border-primary/20 rounded text-white text-sm mb-2"
                />
                <div className="mb-2">
                  <label className="block text-xs font-medium text-white mb-1">Feature Image</label>
                  {feature.image && (
                    <div className="mb-2 relative w-20 h-20">
                      <Image
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const newList = [...config.featuresList]
                        newList[index].imageFile = file
                        setConfig((prev) => ({ ...prev, featuresList: newList }))
                      }
                    }}
                    className="w-full px-3 py-2 bg-background border border-primary/20 rounded text-white text-sm"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Footer Section */}
      {activeSection === "footer" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-primary/20 rounded-xl p-6 space-y-6">
          <h3 className="text-2xl font-bold text-white">Footer Content</h3>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Footer Brand Text</label>
            <textarea
              name="footerBrandText"
              value={config.footerBrandText}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="Brand description in footer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">About Text</label>
            <textarea
              name="footerAbout"
              value={config.footerAbout}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="About section text"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Contact Email</label>
              <input
                type="email"
                name="footerContactEmail"
                value={config.footerContactEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                placeholder="email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Contact Phone</label>
              <input
                type="tel"
                name="footerContactPhone"
                value={config.footerContactPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                placeholder="+234 (0) XXX XXX XXXX"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Contact Location</label>
            <input
              type="text"
              name="footerContactLocation"
              value={config.footerContactLocation || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="City, Country (e.g., Lagos, Nigeria)"
            />
          </div>
        </motion.div>
      )}

      {/* Social Media Settings */}
      {activeSection === "social" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-primary/20 rounded-xl p-6 space-y-6">
          <h3 className="text-2xl font-bold text-white">Social Media Links</h3>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Facebook URL</label>
            <input
              type="url"
              name="socialFacebook"
              value={config.socialFacebook || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="https://facebook.com/yourpage"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Twitter URL</label>
            <input
              type="url"
              name="socialTwitter"
              value={config.socialTwitter || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="https://twitter.com/yourhandle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Instagram URL</label>
            <input
              type="url"
              name="socialInstagram"
              value={config.socialInstagram || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="https://instagram.com/yourprofile"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">YouTube URL</label>
            <input
              type="url"
              name="socialYouTube"
              value={config.socialYouTube || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="https://youtube.com/@yourchannel"
            />
          </div>
        </motion.div>
      )}

      {/* General Settings */}
      {activeSection === "general" && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-primary/20 rounded-xl p-6 space-y-6">
          <h3 className="text-2xl font-bold text-white">General Settings</h3>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Site Title</label>
            <input
              type="text"
              name="siteTitle"
              value={config.siteTitle}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="Website title (SEO)"
            />
            <p className="text-xs text-muted-foreground mt-1">Appears in browser tab and search results</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Site Description</label>
            <textarea
              name="siteDescription"
              value={config.siteDescription}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
              placeholder="Website description (SEO meta tag)"
            />
            <p className="text-xs text-muted-foreground mt-1">Used for search engine optimization</p>
          </div>
        </motion.div>
      )}

      {/* Legal Section */}
      {activeSection === "legal" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid gap-6 bg-card border border-primary/20 rounded-xl p-6"
        >
          <div>
            <h3 className="text-xl font-bold text-primary mb-6">Privacy Policy</h3>
            <label className="block text-sm font-medium text-white mb-2">Privacy Policy Content</label>
            <textarea
              name="privacyPolicyContent"
              value={config.privacyPolicyContent || ''}
              onChange={handleInputChange}
              rows={12}
              className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 font-mono text-sm"
              placeholder="Enter your privacy policy content here. You can use plain text or HTML formatting."
            />
            <p className="text-xs text-muted-foreground mt-2">This content will be displayed on the /privacy page</p>
          </div>

          <div className="border-t border-primary/20 pt-6">
            <h3 className="text-xl font-bold text-primary mb-6">Terms of Service</h3>
            <label className="block text-sm font-medium text-white mb-2">Terms of Service Content</label>
            <textarea
              name="termsOfServiceContent"
              value={config.termsOfServiceContent || ''}
              onChange={handleInputChange}
              rows={12}
              className="w-full px-4 py-3 bg-background border border-primary/20 rounded-lg text-white placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 font-mono text-sm"
              placeholder="Enter your terms of service content here. You can use plain text or HTML formatting."
            />
            <p className="text-xs text-muted-foreground mt-2">This content will be displayed on the /terms page</p>
          </div>
        </motion.div>
      )}

      {/* Save Button */}
      <div className="flex gap-3">
        <motion.button
          onClick={handleSaveSettings}
          disabled={loading}
          className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-black font-semibold rounded-lg transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? "Saving..." : "Save All Settings"}
        </motion.button>
      </div>
    </div>
  )
}
