import type React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { Suspense } from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SettingsProvider } from "../contexts/SettingsContext"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <SettingsProvider>
      <SidebarProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <AppSidebar />
        </Suspense>
        <SidebarInset>
          <Suspense fallback={<div>Loading...</div>}>
            <DashboardHeader />
          </Suspense>
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </SettingsProvider>
  )
}
