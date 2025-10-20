import { PreviewCard } from "./preview-card"
import type { PreviewSettings } from "./types"

interface GridPreviewProps {
  settings: PreviewSettings
}

export function GridPreview({ settings }: GridPreviewProps) {
  const itemCount = settings.layout.columns * settings.layout.rows
  
  return (
    <div className="w-full max-w-7xl mx-auto">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${settings.layout.columns}, minmax(0, 1fr))`,
          gap: `${settings.layout.spacing}px`,
        }}
      >
        {Array.from({ length: itemCount }, (_, i) => i + 1).map((i) => (
          <PreviewCard
            key={i}
            id={i}
            primaryColor={settings.theme.primaryColor}
            cardStyle={settings.card.style}
            borderRadius={settings.card.borderRadius}
          />
        ))}
      </div>
    </div>
  )
}

