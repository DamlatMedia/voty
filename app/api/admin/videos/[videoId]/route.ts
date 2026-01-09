import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params

    const { data: video, error } = await supabase
      .from("videos")
      .select("*")
      .eq("id", videoId)
      .single()

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "Video not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      video,
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params

    console.log("=== VIDEO UPDATE REQUEST ===")
    console.log("Video ID:", videoId)
    console.log("Video ID type:", typeof videoId)
    console.log("Video ID length:", videoId?.length)

    const body = await request.json()
    console.log("Request body:", body)

    // Validate videoId is not empty
    if (!videoId || videoId.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid video ID",
        },
        { status: 400 }
      )
    }

    // Build update object with ONLY safe string fields
    const updateData: Record<string, any> = {}

    // Only add fields that are explicitly provided and not undefined/null
    if (body.title && typeof body.title === 'string') {
      updateData.title = body.title.trim()
    }
    if (body.description && typeof body.description === 'string') {
      updateData.description = body.description.trim()
    }
    if (body.category && typeof body.category === 'string') {
      updateData.category = body.category.trim()
    }

    // Always update the timestamp
    updateData.updated_at = new Date().toISOString()

    console.log("Update data to be applied:", updateData)

    // First check if video exists
    const { data: existingVideo, error: fetchError } = await supabase
      .from("videos")
      .select("id")
      .eq("id", videoId)
      .single()

    if (fetchError || !existingVideo) {
      console.error("Video not found:", fetchError)
      return NextResponse.json(
        {
          success: false,
          message: "Video not found",
        },
        { status: 404 }
      )
    }

    // Perform the update
    const { data: updatedVideo, error } = await supabase
      .from("videos")
      .update(updateData)
      .eq("id", videoId)
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        {
          success: false,
          message: `Database error: ${error.message}`,
        },
        { status: 500 }
      )
    }

    console.log("Video updated successfully:", updatedVideo)

    return NextResponse.json({
      success: true,
      video: updatedVideo,
      message: "Video updated successfully",
    })
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params

    const { error } = await supabase
      .from("videos")
      .delete()
      .eq("id", videoId)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete video",
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Video deleted successfully",
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
