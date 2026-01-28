import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server-client"
import { createClient } from "@supabase/supabase-js"

export const dynamic = 'force-dynamic'

// Generate thumbnail from video URL
async function generateThumbnail(videoUrl: string): Promise<string | null> {
  try {
    // Use a simple approach: use ffmpeg via a service or create a placeholder
    // For now, we'll use a placeholder - in production you might use:
    // - ffmpeg server-side
    // - or a third-party thumbnail service
    
    // Example using a free thumbnail service (if the video is from YouTube):
    // But since we're storing in Supabase, we'll create a simple frame extraction
    
    // For Supabase videos, we can use a simple approach:
    // Create a placeholder or use an external service
    // For now, return null and we'll handle it client-side
    console.log("Thumbnail generation requested for:", videoUrl)
    
    // TODO: Implement proper thumbnail generation
    // Options:
    // 1. Use ffmpeg on the server
    // 2. Use a service like Mux or Cloudinary
    // 3. Create a placeholder based on category
    
    return null
  } catch (error) {
    console.error("Error generating thumbnail:", error)
    return null
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    let query = getSupabaseServerClient()
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false })

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    const { data: videos, error } = await query

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch videos",
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      videos: videos || [],
      total: videos?.length || 0,
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred",
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    console.log("POST /api/admin/videos - Starting upload process")

    // Validate required fields
    if (!body.title || !body.video_url) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and video URL are required",
        },
        { status: 400 }
      )
    }

    // Try to get or create a system admin user in the users table
    console.log("Looking for system admin user in users table...")
    
    let systemUserId: string | null = null

    // First, try to find existing system admin user
    const { data: existingAdmin } = await getSupabaseServerClient()
      .from("users")
      .select("id")
      .eq("email", "system-admin@votyngsystem.local")
      .single()

    if (existingAdmin?.id) {
      systemUserId = existingAdmin.id
      console.log("Found existing system admin user:", systemUserId)
    } else {
      // If no system admin user exists, create one
      console.log("System admin user not found, creating one...")
      
      const { data: newUser, error: createError } = await getSupabaseServerClient()
        .from("users")
        .insert([
          {
            email: "system-admin@votyngsystem.local",
            full_name: "System Admin",
            subscription_status: "active",
          },
        ])
        .select("id")
        .single()

      if (createError) {
        console.error("Error creating system admin user:", createError)
        // Fall back to finding any user
        const { data: anyUser, error: anyError } = await getSupabaseServerClient()
          .from("users")
          .select("id")
          .limit(1)
          .single()

        if (anyError || !anyUser?.id) {
          return NextResponse.json(
            {
              success: false,
              message: "No users found in database. Please create a user account first.",
            },
            { status: 400 }
          )
        }
        systemUserId = anyUser.id
      } else {
        systemUserId = newUser?.id
        console.log("Created new system admin user:", systemUserId)
      }
    }

    if (!systemUserId) {
      return NextResponse.json(
        {
          success: false,
          message: "Could not find or create a system user for uploads.",
        },
        { status: 400 }
      )
    }

    // Generate thumbnail from video
    let thumbnailUrl = body.thumbnail_url || null
    if (!thumbnailUrl && body.video_url) {
      console.log("Generating thumbnail for video...")
      const generatedThumbnail = await generateThumbnail(body.video_url)
      if (generatedThumbnail) {
        thumbnailUrl = generatedThumbnail
      } else {
        // Use a placeholder image based on category
        thumbnailUrl = `https://via.placeholder.com/320x180?text=${encodeURIComponent(body.category || "Video")}`
      }
    }

    // Insert the video with the valid user ID
    const { data: video, error } = await getSupabaseServerClient()
      .from("videos")
      .insert([
        {
          title: body.title,
          description: body.description || null,
          category: body.category || "general",
          video_url: body.video_url,
          thumbnail_url: thumbnailUrl,
          uploaded_by: systemUserId,
          uploader_name: body.uploader_name || "Admin",
          status: body.status || "pending",
          view_count: 0,
          vote_count: 0,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Database error during insert:", error)
      return NextResponse.json(
        {
          success: false,
          message: `Failed to upload video: ${error.message}`,
          error: error.code,
          details: error.details,
        },
        { status: 500 }
      )
    }

    console.log("Video uploaded successfully:", video.id)

    return NextResponse.json({
      success: true,
      video,
      message: "Video uploaded successfully",
    })
  } catch (error) {
    console.error("Error (POST):", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred",
      },
      { status: 500 }
    )
  }
}
