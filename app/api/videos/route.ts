import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "",
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(20)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const transformedVideos = data?.map((video) => ({
      id: video.id,
      title: video.title,
      subtitle: video.category || "Educational Content",
      description: video.description,
      thumbnail: video.thumbnail_url || "/placeholder.svg",
      url: video.video_url,
      duration: 0,
      participantCount: video.view_count || 0,
    })) || []

    return NextResponse.json(transformedVideos)
  } catch (error) {
    console.error("Error fetching videos:", error)
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}
