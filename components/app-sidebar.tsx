"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Package, Sparkles, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {useTranslations, useLocale} from 'next-intl';
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const t = useTranslations('Sidebar');
  const locale = useLocale();
  const pathname = usePathname()
  const isRTL = locale === 'ar'

  const navItems = [
    {
      title: t('products'),
      href: "/dashboard/products",
      icon: Package,
    },
    {
      title: t('settings'),
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <Sidebar collapsible="icon" side={isRTL ? "right" : "left"}>
      <SidebarHeader>
        <div className={cn(
          "flex items-center gap-2 px-2 py-2",
          isRTL && "flex-row-reverse"
        )}>
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Package className="size-4" />
          </div>
          <div className={cn(
            "flex flex-col gap-0.5 leading-none",
            isRTL && "items-end"
          )}>
            <span className="font-semibold">ScreenSense</span>
            <span className="text-xs text-muted-foreground">{t('dashboard')}</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname.startsWith(item.href)

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive} 
                      tooltip={{
                        children: item.title,
                        side: isRTL ? "left" : "right",
                        align: "center"
                      }}
                      className={isRTL ? "flex-row-reverse" : undefined}
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
