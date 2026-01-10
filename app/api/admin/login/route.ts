import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server-client"
import bcrypt from "bcryptjs"

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("[admin-login] 📨 Raw request body:", JSON.stringify(body))

    let { email, password } = body

    // Trim whitespace
    email = email?.trim() || ""
    password = password?.trim() || ""

    console.log("[admin-login] 📨 Trimmed email:", email)
    console.log("[admin-login] 📨 Trimmed password:", password)

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
        },
        { status: 400 }
      )
    }

    // Fetch admin from Supabase by email
    const { data: admins, error } = await getSupabaseServerClient()
      .from("admins")
      .select("*")
      .eq("email", email)
      .limit(1)

    if (error) {
      console.log("[admin-login] ❌ Database error:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Database error",
        },
        { status: 500 }
      )
    }

    if (!admins || admins.length === 0) {
      console.log("[admin-login] ❌ Admin not found:", email)
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      )
    }

    const admin = admins[0]
    console.log("[admin-login] ✅ Admin found:", email)
    console.log("[admin-login] 🔍 Stored password_hash:", admin.password_hash)

    // Compare password with bcrypt hash
    const isPasswordValid = await bcrypt.compare(password, admin.password_hash)

    console.log("[admin-login] 🔍 Provided password:", `"${password}"`)
    console.log("[admin-login] 🔍 Password valid?", isPasswordValid)

    // Compare password with bcrypt hash
    if (!isPasswordValid) {
      console.log("[admin-login] ❌ Password MISMATCH")
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        { status: 401 }
      )
    }

    console.log("[admin-login] ✅ Password MATCH - Admin authenticated!")

    // Create token with admin ID
    const token = Buffer.from(
      JSON.stringify({ adminId: admin.id, timestamp: Date.now() })
    ).toString("base64")

    // Return admin data (without password_hash)
    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: admin.id,
        name: admin.full_name,
        email: admin.email,
        role: admin.role || "admin",
        is_super: admin.is_super,
        pic: admin.pic,
        created_at: admin.created_at,
        updated_at: admin.updated_at,
      },
    })

    // Set token cookie for middleware authentication
    response.cookies.set("sb-auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    })

    return response
  } catch (error) {
    console.error("[admin-login] ❌ Unexpected error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred during login",
      },
      { status: 500 }
    )
  }
}
