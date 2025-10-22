"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GridPreview } from "./grid-preview"
import { CarouselPreview } from "./carousel-preview"
import type { PreviewSettings } from "./types"

interface PreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: PreviewSettings
}

export function PreviewDialog({ open, onOpenChange, settings }: PreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-none w-[100vw] h-[100vh] border-0 p-0 bg-gradient-to-br from-[#042F6A] to-[#4EB2F1] m-0 !rounded-none">
        <DialogHeader className="px-8 pt-6 pb-4">
          <DialogTitle className="text-white text-2xl font-bold">Display Preview</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-auto px-8 pb-8">
          <div className="w-full h-full flex items-center justify-center">
            {settings.layout.style === "grid" && <GridPreview settings={settings} />}
            {settings.layout.style === "carousel" && <CarouselPreview settings={settings} />}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

