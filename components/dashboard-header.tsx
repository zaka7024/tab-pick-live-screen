"use client"

import { LogOut, Monitor, Globe } from "lucide-react"
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
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { routing } from '@/i18n/routing'

export function DashboardHeader() {
  const t = useTranslations('Dashboard');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/login",
      redirect: true,
    })
  }

  const handleLocaleChange = (newLocale: string) => {
    if (newLocale === locale) return;
    
    // Set the locale cookie
    let cookieName = 'USER_LOCALE';
    let cookieMaxAge = 31536000;
    if (routing.localeCookie && typeof routing.localeCookie === 'object' && 'name' in routing.localeCookie) {
      cookieName = routing.localeCookie.name as string;
      if ('maxAge' in routing.localeCookie && routing.localeCookie.maxAge !== undefined) {
        cookieMaxAge = routing.localeCookie.maxAge;
      }
    }
    document.cookie = `${cookieName}=${newLocale}; path=/; max-age=${cookieMaxAge}`;
    
    // Refresh the page to apply the new locale
    router.refresh();
    window.location.reload();
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-border bg-background px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h2 className="text-lg font-semibold text-foreground">{t('header')}</h2>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/display">
          <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
            <Monitor className="h-4 w-4" />
            <span>{t('displayPage')}</span>
          </Button>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
              <Globe className="h-4 w-4" />
              <span>{locale === 'en' ? t('english') : t('arabic')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('language')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {routing.locales.map((loc) => (
              <DropdownMenuItem
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className={locale === loc ? 'bg-accent' : 'cursor-pointer'}
              >
                {loc === 'en' ? t('english') : t('arabic')}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-9 w-9">
                <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel>{t('myAccount')}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('signOut')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
