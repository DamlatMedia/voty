import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import crypto from "crypto"

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    console.log("🔍 Send OTP request received")

    const { phoneNumber, countryCode } = await request.json()

    if (!phoneNumber || !countryCode) {
      return NextResponse.json(
        { success: false, error: "Missing phone number or country code" },
        { status: 400 }
      )
    }

    const fullPhoneNumber = `${countryCode}${phoneNumber}`
    console.log("🔍 Sending OTP to:", fullPhoneNumber)

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    console.log("🔍 Generated OTP:", otp)

    // Check if Twilio is configured
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      console.warn("⚠️ Twilio not configured, returning test OTP")
      // For testing without Twilio, return the OTP (should be removed in production)
      return NextResponse.json({
        success: true,
        message: "OTP sent to phone",
        testOTP: otp, // Only for development
      })
    }

    // Send SMS via Twilio
    const auth = Buffer.from(
      `${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`
    ).toString("base64")

    const formData = new FormData()
    formData.append("To", fullPhoneNumber)
    formData.append("From", process.env.TWILIO_PHONE_NUMBER)
    formData.append("Body", `Your VOTY verification code is: ${otp}. Valid for 10 minutes.`)

    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
        },
        body: formData,
      }
    )

    if (!twilioResponse.ok) {
      const error = await twilioResponse.text()
      console.error("❌ Twilio error:", error)
      throw new Error(`Twilio API error: ${error}`)
    }

    console.log("✅ SMS sent via Twilio")

    // Store OTP in database (expires in 10 minutes)
    const supabase = await createClient()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

    const { data, error: dbError } = await supabase
      .from("phone_verifications")
      .insert({
        phone_number: phoneNumber,
        country_code: countryCode,
        verification_code: otp,
        expires_at: expiresAt,
        is_verified: false,
        attempts: 0,
      })
      .select()
      .single()

    if (dbError) {
      console.error("❌ Database error:", dbError)
      return NextResponse.json(
        { success: false, error: "Failed to store OTP" },
        { status: 500 }
      )
    }

    console.log("✅ OTP stored in database")

    return NextResponse.json({
      success: true,
      message: "OTP sent to your phone",
    })
  } catch (error) {
    console.error("❌ Send OTP error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to send OTP",
      },
      { status: 500 }
    )
  }
}
