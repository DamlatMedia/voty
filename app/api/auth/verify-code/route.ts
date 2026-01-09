import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
          } catch {}
        },
      },
    },
  )

  try {
    const { phoneNumber, countryCode, code } = await request.json()

    if (!phoneNumber || !countryCode || !code) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify code in database
    const { data, error: dbError } = await supabase
      .from("phone_verifications")
      .select("*")
      .eq("phone_number", phoneNumber)
      .eq("country_code", countryCode)
      .eq("verification_code", code)
      .gt("expires_at", new Date().toISOString())
      .single()

    if (dbError || !data) {
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 })
    }

    if (data.is_verified) {
      return NextResponse.json({ error: "Code already verified" }, { status: 400 })
    }

    if (data.attempts >= 3) {
      return NextResponse.json({ error: "Maximum attempts exceeded" }, { status: 400 })
    }

    // Mark as verified
    const { error: updateError } = await supabase
      .from("phone_verifications")
      .update({
        is_verified: true,
        attempts: data.attempts + 1,
      })
      .eq("id", data.id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Phone number verified successfully",
    })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
