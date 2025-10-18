"use client"

import { LogOut, Monitor } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"
import { signOut } from "next-auth/react"

export function DashboardHeader() {
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/login",
      redirect: true,
    })
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h2 className="text-lg font-semibold text-foreground">ScreenScese Dashboard</h2>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
            <Monitor className="h-4 w-4" />
            <span>Display Page</span>
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
