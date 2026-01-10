import { getSupabaseServerClient } from "@/lib/supabase/server-client"
import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies()
    const token = cookieStore.get("sb-auth-token")?.value

    if (!token) {
      console.error("[change-password] No token found in cookies")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[change-password] Token found, length:", token.length)

    // Decode token to get user ID
    let userId: string | null = null

    try {
      // Try base64 decoding first (this is what login endpoint creates)
      const decodedToken = JSON.parse(Buffer.from(token, "base64").toString())
      userId = decodedToken.userId || decodedToken.sub || decodedToken.id
      console.log("[change-password] Extracted userId from base64 token:", userId)
    } catch (base64Error) {
      console.log("[change-password] Base64 parsing failed, trying JWT format...")
      
      // Try JWT format as fallback
      try {
        const parts = token.split(".")
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], "base64").toString())
          userId = payload.sub || payload.user_id || payload.id || payload.userId
          console.log("[change-password] Extracted userId from JWT:", userId)
        }
      } catch (jwtError) {
        console.log("[change-password] JWT parsing also failed:", jwtError)
      }
    }

    if (!userId) {
      console.error("[change-password] Could not extract user ID from token")
      console.error("[change-password] Token content:", token.substring(0, 50) + "...")
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

      const { oldPassword, newPassword } = await request.json()

      // Validate inputs
      if (!oldPassword || !newPassword) {
        return NextResponse.json(
          { error: "Old password and new password are required" },
          { status: 400 }
        )
      }

      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters" },
          { status: 400 }
        )
      }

      console.log("[change-password] Attempting to change password for user:", userId)
      console.log("[change-password] Using Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
      console.log("[change-password] Service Role Key available:", !!process.env.SUPABASE_SERVICE_ROLE_KEY)

      // Fetch user from database - select all columns (same as login endpoint)
      const { data: users, error: fetchError } = await getSupabaseServerClient()
        .from("users")
        .select("*")
        .eq("id", userId)
        .limit(1)

      console.log("[change-password] Query result - users:", users, "error:", fetchError)
      console.log("[change-password] Users array length:", users?.length)

      if (fetchError) {
        console.error("[change-password] Database query error:", fetchError)
        return NextResponse.json(
          { error: "Database error", details: fetchError.message },
          { status: 500 }
        )
      }

      if (!users || users.length === 0) {
        console.error("[change-password] User not found with ID:", userId)
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        )
      }

      const user = users[0]
      console.log("[change-password] User found:", user.id)

      // Hash the old password to verify it matches
      const oldPasswordHash = crypto
        .createHash("sha256")
        .update(oldPassword)
        .digest("hex")

      console.log("[change-password] Old password hash:", oldPasswordHash)
      console.log("[change-password] Stored password hash:", user.password_hash)

      // Compare old password with stored hash
      if (oldPasswordHash !== user.password_hash) {
        console.log("[change-password] Old password does not match")
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 401 }
        )
      }

      // Hash the new password
      const newPasswordHash = crypto
        .createHash("sha256")
        .update(newPassword)
        .digest("hex")

      console.log("[change-password] New password hash:", newPasswordHash)

      // Update user password in database
      const { data: updatedUser, error: updateError } = await getSupabaseServerClient()
        .from("users")
        .update({
          password_hash: newPasswordHash,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      console.log("[change-password] Update result - data:", updatedUser, "error:", updateError)

      if (updateError) {
        console.error("[change-password] Error updating password:", updateError)
        return NextResponse.json(
          { error: "Failed to update password", details: updateError.message },
          { status: 500 }
        )
      }

      console.log("[change-password] Password updated successfully for user:", userId)

      return NextResponse.json({
        success: true,
        message: "Password changed successfully",
      })
  } catch (error) {
    console.error("[change-password] Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
