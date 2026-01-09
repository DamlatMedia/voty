import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {

    const formData = await request.formData()
    const adminId = formData.get('adminId') as string
    const configString = formData.get('config') as string
    const siteImageFile = formData.get('siteImage') as File | null
    const heroImageFile = formData.get('heroImage') as File | null

    if (!configString || !adminId) {
      return NextResponse.json(
        { success: false, message: 'Config data and adminId are required' },
        { status: 400 }
      )
    }

    // Parse the config
    let config: Record<string, any>
    try {
      config = JSON.parse(configString)
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid config JSON' },
        { status: 400 }
      )
    }

    // Handle file uploads if provided
    if (siteImageFile) {
      const buffer = await siteImageFile.arrayBuffer()
      const uploadsDir = join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadsDir, { recursive: true })

      const filename = `site-image-${Date.now()}.${siteImageFile.type.split('/')[1] || 'png'}`
      const filepath = join(uploadsDir, filename)
      await writeFile(filepath, Buffer.from(buffer))
      config.site_image = `/uploads/${filename}`
    }

    if (heroImageFile) {
      const buffer = await heroImageFile.arrayBuffer()
      const uploadsDir = join(process.cwd(), 'public', 'uploads')
      await mkdir(uploadsDir, { recursive: true })

      const filename = `hero-${Date.now()}.${heroImageFile.type.split('/')[1] || 'png'}`
      const filepath = join(uploadsDir, filename)
      await writeFile(filepath, Buffer.from(buffer))
      config.hero_image = `/uploads/${filename}`
    }

    // Convert camelCase to snake_case for database
    const dbSettings = {
      site_name: config.site_name || config.siteName || 'VotNG',
      brand_name: config.brand_name || config.brandName,
      brand_tagline: config.brand_tagline || config.brandTagline,
      site_image: config.site_image || config.siteImage,
      primary_color: config.primary_color || config.primaryColor,
      hero_title: config.hero_title || config.heroTitle,
      hero_subtitle: config.hero_subtitle || config.heroSubtitle,
      hero_description: config.hero_description || config.heroDescription,
      hero_image: config.hero_image || config.heroImage,
      features_title: config.features_title || config.featuresTitle,
      features_list: config.features_list || config.featuresList || [],
      footer_brand_text: config.footer_brand_text || config.footerBrandText,
      footer_about: config.footer_about || config.footerAbout,
      footer_contact_email: config.footer_contact_email || config.footerContactEmail,
      footer_contact_phone: config.footer_contact_phone || config.footerContactPhone,
      footer_contact_location: config.footer_contact_location || config.footerContactLocation,
      footer_text: config.footer_text || config.footerText,
      site_title: config.site_title || config.siteTitle,
      site_description: config.site_description || config.siteDescription,
      social_facebook: config.social_facebook || config.socialFacebook,
      social_twitter: config.social_twitter || config.socialTwitter,
      social_instagram: config.social_instagram || config.socialInstagram,
      privacy_policy_content: config.privacy_policy_content || config.privacyPolicyContent,
      terms_of_service_content: config.terms_of_service_content || config.termsOfServiceContent,
      admin_id: adminId
    }

    // Get existing settings to update or insert
    const { data: existingSettings } = await supabase
      .from('page_settings')
      .select('*')
      .eq('admin_id', adminId)
      .maybeSingle()

    let result
    if (existingSettings) {
      // When updating, preserve existing images if no new ones are uploaded
      const updateSettings = {
        ...dbSettings,
        // Keep existing images if new ones weren't uploaded
        site_image: dbSettings.site_image || existingSettings.site_image,
        hero_image: dbSettings.hero_image || existingSettings.hero_image,
      }
      // Update existing
      result = await supabase
        .from('page_settings')
        .update(updateSettings)
        .eq('id', existingSettings.id)
        .select()
        .single()
    } else {
      // Insert new
      result = await supabase
        .from('page_settings')
        .insert([dbSettings])
        .select()
        .single()
    }

    if (result.error) {
      console.error('Database error:', result.error)
      return NextResponse.json(
        { success: false, message: 'Failed to save settings to database' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Page settings saved successfully',
      config: result.data
    })
  } catch (error) {
    console.error('Error saving page settings:', error)
    return NextResponse.json(
      { success: false, message: 'Error saving page settings' },
      { status: 500 }
    )
  }
}

// GET: Retrieve page settings
export async function GET() {
  try {
    // Get latest page settings (public read)
    const { data: settings } = await supabase
      .from('page_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (settings) {
      return NextResponse.json({
        success: true,
        config: settings
      })
    }

    // Return empty config if no settings exist - no hardcoded defaults
    const emptyConfig = {
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
      footer_text: '',
      site_title: '',
      site_description: ''
    }

    return NextResponse.json({
      success: true,
      config: emptyConfig
    })
  } catch (error) {
    console.error('Error fetching page settings:', error)
    return NextResponse.json({
      success: true,
      config: {
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
        footer_text: '',
        site_title: '',
        site_description: ''
      }
    })
  }
}
