import type React from "react"
import type { Metadata } from "next"
import { Montserrat } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import ErrorBoundary from "@/components/error-boundary"
import "./globals.css"

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600", "700", "800"] })

// Make all pages dynamic - don't pre-render at build time
// This is needed because the app uses authentication and personalized dashboards
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "VOTY - Voice of the Teenagers and the Youths",
  description:
    "Empowering Nigerian youth through education, ethics, and skill-building opportunities. Participate in videos, quizzes, and votes.",
  generator: "v0.app",
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#000000" />
        <meta name="description" content={metadata.description as string} />
      </head>
      <body className={`${montserrat.className} antialiased bg-background text-foreground`} suppressHydrationWarning>
        <ErrorBoundary>{children}</ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
