import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server-client"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { data: users, error } = await getSupabaseServerClient()
      .from("users")
      .select("id, full_name, email, phone_number, subscription_status, created_at, updated_at, pic")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch users",
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      users: users || [],
      total: users?.length || 0,
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

export async function DELETE(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      )
    }

    const { error } = await getSupabaseServerClient()
      .from("users")
      .delete()
      .eq("id", userId)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to delete user",
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "User deleted successfully",
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
