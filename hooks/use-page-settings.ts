"use client"

import { useEffect, useState } from "react"

interface PageSettings {
  site_name: string
  brand_name: string
  brand_tagline: string
  site_image: string | null
  primary_color: string
  hero_title: string
  hero_subtitle: string
  hero_description: string
  hero_image: string | null
  features_title: string
  features_list: Array<{ title: string; description: string; image?: string }>
  footer_brand_text: string
  footer_about: string
  footer_contact_email: string
  footer_contact_phone: string
  footer_contact_location: string | null
  footer_text: string
  site_title: string
  site_description: string
  social_facebook: string | null
  social_twitter: string | null
  social_instagram: string | null
  privacy_policy_content: string | null
  terms_of_service_content: string | null
  updated_at: string | null
}

// const defaultSettings: PageSettings = {
//   site_name: '',
//   brand_name: '',
//   brand_tagline: 'Voice of the Youth',
//   site_image: '/voty-logo.png',
//   primary_color: '#3B82F6',
//   hero_title: '',
//   hero_subtitle: 'Share your votes, shape the results',
//   hero_description: 'Vote on your favorite content',
//   hero_image: '/hero-image.jpg',
//   features_title: 'Features',
//   features_list: [],
//   footer_brand_text: 'VotNG - Voice of the Users',
//   footer_about: 'A voting platform for everyone',
//   footer_contact_email: 'info@votng.com',
//   footer_contact_phone: '+1 (555) 000-0000',
//   footer_contact_location: 'Lagos, Nigeria',
//   footer_text: 'Copyright © 2026 VotNG. All rights reserved.',
//   site_title: 'VotNG - Vote on Everything',
//   site_description: 'Vote on your favorite content',
//   social_facebook: null,
//   social_twitter: null,
//   social_instagram: null,
//   privacy_policy_content: null,
//   terms_of_service_content: null,
//   updated_at: null,
// }

// Empty settings for initial state - nothing from hardcoded defaults
const emptySettings: PageSettings = {
  site_name: '',
  brand_name: '',
  brand_tagline: '',
  site_image: null,
  primary_color: '',
  hero_title: '',
  hero_subtitle: '',
  hero_description: '',
  hero_image: null,
  features_title: '',
  features_list: [],
  footer_brand_text: '',
  footer_about: '',
  footer_contact_email: '',
  footer_contact_phone: '',
  footer_contact_location: null,
  footer_text: '',
  site_title: '',
  site_description: '',
  social_facebook: null,
  social_twitter: null,
  social_instagram: null,
  privacy_policy_content: null,
  terms_of_service_content: null,
  updated_at: null,
}

export function usePageSettings() {
  const [settings, setSettings] = useState<PageSettings>(emptySettings)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    const fetchSettings = async () => {
      try {
        // Check localStorage first for cached settings
        const cached = localStorage.getItem('pageSettings')
        if (cached) {
          try {
            const cachedSettings = JSON.parse(cached)
            setSettings(cachedSettings)
            setLoading(false)
            // Still fetch fresh data in background
            fetchFresh()
            return
          } catch (e) {
            console.error('Failed to parse cached settings:', e)
          }
        }
        
        setLoading(true)
        await fetchFresh()
      } catch (err) {
        console.error('Failed to fetch page settings:', err)
        setError(err instanceof Error ? err.message : 'Failed to load settings')
        setLoading(false)
      }
    }
    
    const fetchFresh = async () => {
      try {
        const response = await fetch('/api/admin/page-settings', {
          next: { revalidate: 3600 } // Cache for 1 hour
        })
        const data = await response.json()
        
        if (data.success && data.config) {
          // Save to localStorage and state
          localStorage.setItem('pageSettings', JSON.stringify(data.config))
          setSettings(data.config)
        }
        setError(null)
      } catch (err) {
        console.error('Failed to fetch page settings:', err)
        setError(err instanceof Error ? err.message : 'Failed to load settings')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return { settings, loading, error, mounted }
}
