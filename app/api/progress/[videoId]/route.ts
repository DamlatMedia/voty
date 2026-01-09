import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: Request, { params }: { params: { videoId: string } }) {
  try {
    const { videoId } = params
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch user's progress for this video
    const { data, error } = await supabase
      .from("video_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("video_id", videoId)
      .maybeSingle()

    if (error) {
      console.error("Error fetching progress:", error)
      return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 })
    }

    // If no progress exists yet, return default
    if (!data) {
      return NextResponse.json({
        videoId,
        progress: 0,
        total_duration_seconds: 0,
        status: "not_started",
        lastWatched: null,
      })
    }

    return NextResponse.json({
      videoId,
      progress: data.progress_seconds,
      total_duration_seconds: data.total_duration_seconds,
      status: data.status,
      lastWatched: data.last_watched_at,
    })
  } catch (error) {
    console.error("Progress API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { videoId: string } }) {
  try {
    const { videoId } = params
    const { progress: progressSeconds, duration: totalDuration } = await request.json()

    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Determine status based on progress percentage
    const progressPercentage = totalDuration > 0 ? (progressSeconds / totalDuration) * 100 : 0
    const status = progressPercentage >= 90 ? "completed" : "watching"

    console.log(`Updating progress for user ${user.id}, video ${videoId}:`, {
      progressSeconds,
      totalDuration,
      progressPercentage: Math.round(progressPercentage),
      status,
    })

    // Upsert video progress
    const { data, error } = await supabase
      .from("video_progress")
      .upsert(
        {
          user_id: user.id,
          video_id: videoId,
          progress_seconds: progressSeconds,
          total_duration_seconds: totalDuration,
          status: status,
          last_watched_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id,video_id",
        }
      )
      .select()
      .single()

    if (error) {
      console.error("Error updating progress:", error)
      return NextResponse.json({ error: "Failed to update progress", details: error }, { status: 500 })
    }

    console.log("Progress updated successfully:", data)

    return NextResponse.json({
      success: true,
      message: "Progress updated",
      data,
    })
  } catch (error) {
    console.error("Progress API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
