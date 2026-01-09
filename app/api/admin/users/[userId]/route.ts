import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single()

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user,
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
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId
    const body = await request.json()

    const { data: updatedUser, error } = await supabase
      .from("users")
      .update({
        full_name: body.full_name,
        phone_number: body.phone_number,
        subscription_status: body.subscription_status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update user",
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "User updated successfully",
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

export async function DELETE(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId

    const { error } = await supabase
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
