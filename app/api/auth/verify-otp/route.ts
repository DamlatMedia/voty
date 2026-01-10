import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    console.log("🔍 Verify OTP request received")

    const { phoneNumber, countryCode, otp } = await request.json()
    console.log("🔍 Params:", { phoneNumber, countryCode, otp })

    if (!phoneNumber || !countryCode || !otp) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Find the OTP record
    console.log("🔍 Querying phone_verifications for:", phoneNumber, countryCode)
    
    const { data: records, error: findError } = await supabase
      .from("phone_verifications")
      .select("*")
      .eq("phone_number", phoneNumber)
      .eq("country_code", countryCode)
      .order("created_at", { ascending: false })
      .limit(1)

    console.log("🔍 Query result:", { error: findError, recordCount: records?.length })

    if (findError) {
      console.error("❌ Database query error:", findError)
      return NextResponse.json(
        { success: false, error: "Database error: " + findError.message },
        { status: 500 }
      )
    }

    if (!records || records.length === 0) {
      console.error("❌ No verification record found")
      return NextResponse.json(
        { success: false, error: "No verification code sent for this number" },
        { status: 404 }
      )
    }

    const record = records[0]
    console.log("🔍 Record found:", { id: record.id, storedCode: record.verification_code, attempts: record.attempts })

    // Check if OTP is expired
    if (record.expires_at && new Date(record.expires_at) < new Date()) {
      console.error("❌ OTP expired")
      return NextResponse.json(
        { success: false, error: "Verification code has expired" },
        { status: 400 }
      )
    }

    // Check if max attempts exceeded
    if (record.attempts >= (record.max_attempts || 3)) {
      console.error("❌ Max attempts exceeded")
      return NextResponse.json(
        { success: false, error: "Too many failed attempts. Please request a new code." },
        { status: 429 }
      )
    }

    // Verify OTP
    const storedCode = String(record.verification_code).trim()
    const providedCode = String(otp).trim()

    console.log("🔍 Comparing codes - Stored:", storedCode, "Provided:", providedCode, "Match:", storedCode === providedCode)

    if (storedCode !== providedCode) {
      console.error("❌ Invalid OTP")
      
      // Increment attempts
      const { error: updateError } = await supabase
        .from("phone_verifications")
        .update({ attempts: record.attempts + 1 })
        .eq("id", record.id)

      if (updateError) {
        console.error("❌ Failed to update attempts:", updateError)
      }

      return NextResponse.json(
        { success: false, error: "Invalid verification code" },
        { status: 400 }
      )
    }

    console.log("✅ OTP verified successfully")

    // Mark as verified
    const { error: updateError } = await supabase
      .from("phone_verifications")
      .update({ 
        is_verified: true, 
        verified_at: new Date().toISOString(),
        attempts: 0 
      })
      .eq("id", record.id)

    if (updateError) {
      console.error("❌ Failed to update verification status:", updateError)
      return NextResponse.json(
        { success: false, error: "Failed to verify OTP" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Phone number verified successfully",
    })
  } catch (error) {
    console.error("❌ Verify OTP error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to verify OTP",
      },
      { status: 500 }
    )
  }
}
