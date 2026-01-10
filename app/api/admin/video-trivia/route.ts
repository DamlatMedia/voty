import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server-client"

// GET: Fetch all trivia questions for a specific video
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get("videoId")

    if (!videoId) {
      const { data: trivia } = await getSupabaseServerClient()
        { success: false, message: "videoId is required" },
        { status: 400 }
      )
    }

    // Fetch trivia questions linked to this video, ordered by display order
    const { data, error } = await supabase
      .from("video_trivia")
      .select(`
        id,
        display_order,
        trivia_question_id,
        trivia_questions (
          id,
          question,
          options,
          correct_answer,
          category,
          difficulty
        )
      `)
      .eq("video_id", videoId)
      .order("display_order", { ascending: true })

    if (error) {
      console.error("Error fetching video trivia:", error)
      return NextResponse.json(
        { success: false, message: "Failed to fetch trivia questions" },
        { status: 500 }
      )
    }

    // Transform data to match frontend expectations
    const questions = data?.map((item: any) => ({
      id: item.trivia_questions.id,
      question: item.trivia_questions.question,
      options: item.trivia_questions.options,
      correct_answer: item.trivia_questions.correct_answer,
      category: item.trivia_questions.category,
      difficulty: item.trivia_questions.difficulty,
    })) || []

    return NextResponse.json({
      success: true,
      questions,
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    )
  }
}

// POST: Link trivia questions to a video
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { videoId, trivia_question_ids } = body

    if (!videoId || !trivia_question_ids || !Array.isArray(trivia_question_ids)) {
      return NextResponse.json(
        { success: false, message: "videoId and trivia_question_ids array are required" },
        { status: 400 }
      )
    }

    // Check if video exists
    const { data: videoExists, error: videoError } = await supabase
      .from("videos")
      .select("id")
      .eq("id", videoId)
      .single()

    if (videoError || !videoExists) {
      return NextResponse.json(
        { success: false, message: "Video not found" },
        { status: 404 }
      )
    }

    // Delete existing trivia associations for this video
    await supabase.from("video_trivia").delete().eq("video_id", videoId)

    // Insert new associations
    const insertData = trivia_question_ids.map((questionId: string, index: number) => ({
      video_id: videoId,
      trivia_question_id: questionId,
      display_order: index,
    }))

    const { error: insertError } = await supabase
      .from("video_trivia")
      .insert(insertData)

    if (insertError) {
      console.error("Error inserting video trivia:", insertError)
      return NextResponse.json(
        { success: false, message: "Failed to link trivia questions" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Trivia questions linked successfully",
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    )
  }
}

// DELETE: Remove trivia from a video
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const videoId = searchParams.get("videoId")

    if (!videoId) {
      return NextResponse.json(
        { success: false, message: "videoId is required" },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("video_trivia")
      .delete()
      .eq("video_id", videoId)

    if (error) {
      console.error("Error deleting video trivia:", error)
      return NextResponse.json(
        { success: false, message: "Failed to remove trivia" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Trivia removed successfully",
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      { success: false, message: "An error occurred" },
      { status: 500 }
    )
  }
}
