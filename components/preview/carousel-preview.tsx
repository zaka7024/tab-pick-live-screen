import { PreviewCard } from "./preview-card"
import type { PreviewSettings } from "./types"

interface CarouselPreviewProps {
  settings: PreviewSettings
}

export function CarouselPreview({ settings }: CarouselPreviewProps) {
  return (
    <div className="relative w-full max-w-7xl mx-auto">
      {/* Main Product Display - Simulating the carousel view */}
      <div className="w-full flex items-center justify-center mb-8">
        <div style={{ width: `${settings.layoutSpecific.carousel.itemWidth}px` }}>
          <PreviewCard
            id={1}
            primaryColor={settings.theme.primaryColor}
            cardStyle={settings.card.style}
            borderRadius={settings.card.borderRadius}
          />
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="flex justify-center gap-3 mt-8">
        {[1, 2, 3, 4, 5].map((_, index) => (
          <div
            key={index}
            className={`h-2 w-16 rounded-full ${
              index === 0 ? 'bg-white' : 'bg-white/30'
            }`}
            style={{ borderRadius: `${settings.card.borderRadius}px` }}
          />
        ))}
      </div>

      {/* Product Counter */}
      <div className="text-center mt-6">
        <span className="text-4xl font-semibold text-white/80">
          1 / 5
        </span>
      </div>
    </div>
  )
}

