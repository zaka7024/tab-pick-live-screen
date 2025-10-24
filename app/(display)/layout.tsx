"use client";

import type React from "react"
import { SettingsProvider } from "../contexts/SettingsContext"

export default function DisplayLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <SettingsProvider>
      <main>{children}</main>
    </SettingsProvider>
  )
}
