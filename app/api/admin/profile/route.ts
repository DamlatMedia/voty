import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server-client"
import bcrypt from "bcryptjs"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const adminId = searchParams.get("id")

    if (!adminId) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin ID is required",
        },
        { status: 400 }
      )
    }

    const { data: admin, error } = await getSupabaseServerClient()
      .from("admins")
      .select("id, email, full_name, pic, created_at, updated_at")
      .eq("id", adminId)
      .single()

    if (error) {
      console.error("Error fetching admin profile:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch profile",
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      admin,
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred",
      },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const formData = await request.formData()
    const adminId = formData.get("adminId") as string
    const full_name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const profilePicFile = formData.get("pic") as File | null

    if (!adminId) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin ID is required",
        },
        { status: 400 }
      )
    }

    // Build update object
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    if (full_name) {
      updateData.full_name = full_name
    }

    if (email) {
      updateData.email = email
    }

    // Handle password update if provided
    if (password && password.trim().length > 0) {
      // Hash the new password
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      updateData.password_hash = hashedPassword
      console.log("Password updated for admin:", adminId)
    }

    // Handle profile picture upload
    if (profilePicFile) {
      try {
        // Convert file to base64
        const bytes = await profilePicFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64 = buffer.toString("base64")
        const dataUrl = `data:${profilePicFile.type};base64,${base64}`

        updateData.pic = dataUrl
        console.log("Profile picture updated for admin:", adminId)
      } catch (error) {
        console.error("Error processing profile picture:", error)
        return NextResponse.json(
          {
            success: false,
            message: "Failed to process profile picture",
          },
          { status: 400 }
        )
      }
    }

    // Update admin profile in database
    const { data: updatedAdmin, error } = await getSupabaseServerClient()
      .from("admins")
      .update(updateData)
      .eq("id", adminId)
      .select("id, email, full_name, pic, created_at, updated_at")
      .single()

    if (error) {
      console.error("Error updating admin profile:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Failed to update profile",
          error: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      admin: updatedAdmin,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "An error occurred",
      },
      { status: 500 }
    )
  }
}
