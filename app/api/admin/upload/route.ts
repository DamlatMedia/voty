import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server-client"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string // "video", "thumbnail", or "feature"

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      )
    }

    // Validate file type
    const validVideoTypes = ["video/mp4", "video/webm", "video/quicktime"]
    const validImageTypes = ["image/jpeg", "image/png", "image/webp"]

    if (type === "video" && !validVideoTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: `Invalid video type. Allowed: ${validVideoTypes.join(", ")}` },
        { status: 400 }
      )
    }

    if ((type === "thumbnail" || type === "feature") && !validImageTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: `Invalid image type. Allowed: ${validImageTypes.join(", ")}` },
        { status: 400 }
      )
    }

    // Max sizes
    const MAX_VIDEO_SIZE = 500 * 1024 * 1024 // 500MB
    const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB

    if (type === "video" && file.size > MAX_VIDEO_SIZE) {
      return NextResponse.json(
        { success: false, message: "Video file too large (max 500MB)" },
        { status: 400 }
      )
    }

    if ((type === "thumbnail" || type === "feature") && file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { success: false, message: "Image file too large (max 10MB)" },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(7)
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${timestamp}-${random}-${originalName}`

    // Determine bucket and path
    const bucket = type === "video" ? "videos" : "thumbnails"
    const path = `${bucket}/${filename}`

    // Convert file to buffer
    const buffer = await file.arrayBuffer()

    // Upload to Supabase Storage
    const { data, error } = await getSupabaseServerClient().storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: file.type,
        cacheControl: "3600",
      })

    if (error) {
      console.error("Upload error:", error)
      return NextResponse.json(
        { success: false, message: `Upload failed: ${error.message}` },
        { status: 500 }
      )
    }

    // Get the public URL
    const { data: publicData } = getSupabaseServerClient().storage
      .from(bucket)
      .getPublicUrl(data.path)

    return NextResponse.json({
      success: true,
      url: publicData.publicUrl,
      path: data.path,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json(
      { success: false, message: "Upload error" },
      { status: 500 }
    )
  }
}
