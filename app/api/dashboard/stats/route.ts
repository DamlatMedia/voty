import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Fetching stats for user:", user.id)

    // Get watching videos count
    const { data: watchingData, error: watchingError } = await supabase
      .from("video_progress")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "watching")

    console.log("Watching videos:", { data: watchingData, error: watchingError })

    // Get completed videos count
    const { data: completedData, error: completedError } = await supabase
      .from("video_progress")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "completed")

    console.log("Completed videos:", { data: completedData, error: completedError })

    // Get votes count
    const { data: votesData, error: votesError } = await supabase
      .from("votes")
      .select("id")
      .eq("user_id", user.id)

    console.log("Votes:", { data: votesData, error: votesError })

    if (watchingError || completedError || votesError) {
      console.error("Errors fetching stats:", { watchingError, completedError, votesError })
      return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
    }

    const stats = {
      watching: watchingData?.length || 0,
      completed: completedData?.length || 0,
      votes: votesData?.length || 0,
    }

    console.log("Final stats:", stats)

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error("Dashboard stats API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
