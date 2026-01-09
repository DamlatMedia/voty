import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Get all trivia questions
    const { data, error } = await supabase
      .from("trivia_questions")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ questions: data || [] })
  } catch (error) {
    console.error("Error fetching trivia questions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { question, options, correctAnswer, category, difficulty, adminId } =
      body

    // Validate required fields
    if (
      !question ||
      !options ||
      options.length !== 4 ||
      !correctAnswer ||
      !category ||
      !difficulty
    ) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      )
    }

    console.log("Inserting trivia question:", {
      question,
      category,
      difficulty,
      admin_id: adminId,
    })

    // Insert trivia question
    const { data, error } = await supabase
      .from("trivia_questions")
      .insert([
        {
          question,
          options,
          correct_answer: correctAnswer,
          category,
          difficulty,
          admin_id: adminId,
        },
      ])
      .select()

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(
      { question: data[0], message: "Question added successfully" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating trivia question:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing question ID" }, { status: 400 })
    }

    const body = await request.json()
    const { question, options, correctAnswer, category, difficulty } = body

    // Validate required fields
    if (
      !question ||
      !options ||
      options.length !== 4 ||
      !correctAnswer ||
      !category ||
      !difficulty
    ) {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      )
    }

    // Update trivia question
    const { data, error } = await supabase
      .from("trivia_questions")
      .update({
        question,
        options,
        correct_answer: correctAnswer,
        category,
        difficulty,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (data && data.length === 0) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 })
    }

    return NextResponse.json({
      question: data[0],
      message: "Question updated successfully",
    })
  } catch (error) {
    console.error("Error updating trivia question:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing question ID" }, { status: 400 })
    }

    // Delete trivia question
    const { error } = await supabase
      .from("trivia_questions")
      .delete()
      .eq("id", id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      message: "Question deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting trivia question:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
