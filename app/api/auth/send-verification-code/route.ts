import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()

  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
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
  })

  try {
    const body = await request.json()
    const { phoneNumber, countryCode } = body

    if (!phoneNumber || !countryCode) {
      return NextResponse.json({ error: "Missing phone number or country code" }, { status: 400 })
    }

    // Generate verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    const { error: dbError } = await supabase.from("phone_verifications").insert({
      phone_number: phoneNumber,
      country_code: countryCode,
      verification_code: code,
      is_verified: false,
      attempts: 0,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes expiry
    })

    if (dbError) {
      console.error("[v0] Supabase error:", dbError)
      return NextResponse.json({ error: `Database error: ${dbError.message}` }, { status: 500 })
    }

    let smsSent = false
    let smsError = null

    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
      try {
        // Use fetch to call Twilio API directly instead of using the SDK
        const fullPhoneNumber = `+${countryCode}${phoneNumber}`
        const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString(
          "base64",
        )

        const formData = new URLSearchParams()
        formData.append("Body", `Your verification code is: ${code}. This code expires in 10 minutes.`)
        formData.append("From", process.env.TWILIO_PHONE_NUMBER)
        formData.append("To", fullPhoneNumber)

        const twilioResponse = await fetch(
          `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
          {
            method: "POST",
            headers: {
              Authorization: `Basic ${auth}`,
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
          },
        )

        if (twilioResponse.ok) {
          console.log(`[v0] SMS sent to +${countryCode}${phoneNumber}`)
          smsSent = true
        } else {
          const twilioError = await twilioResponse.text()
          console.warn("[v0] Twilio API error:", twilioError)
          smsError = "SMS delivery failed"
        }
      } catch (error) {
        console.warn("[v0] SMS sending error:", error instanceof Error ? error.message : error)
        smsError = "Could not send SMS"
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: smsSent ? "Verification code sent via SMS" : "Verification code saved (SMS not available)",
        codeSaved: true,
        smsSent,
        smsNote: smsError || (smsSent ? null : "SMS not configured"),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] API Error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ error: `Internal server error: ${errorMessage}` }, { status: 500 })
  }
}
