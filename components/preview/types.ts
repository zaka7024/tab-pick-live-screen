export interface PreviewSettings {
  theme: {
    primaryColor: string
    secondaryColor: string
  }
  layout: {
    style: string
    columns: number
    rows: number
    spacing: number
  }
  card: {
    style: string
    borderRadius: number
  }
  layoutSpecific: {
    carousel: {
      itemWidth: number
      gap: number
    }
  }
}

