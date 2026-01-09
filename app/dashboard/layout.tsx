"use client"

import type React from "react"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import SupportChat from "@/components/dashboard/support-chat"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-black min-h-screen flex flex-col">
      <DashboardHeader />
      <main className="flex-1 pt-20 pb-8" role="main">
        {children}
      </main>
      <SupportChat />
    </div>
  )
}
