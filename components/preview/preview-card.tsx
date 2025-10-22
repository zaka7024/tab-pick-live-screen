interface PreviewCardProps {
  id: number
  primaryColor: string
  cardStyle: string
  borderRadius: number
}

export function PreviewCard({ id, primaryColor, cardStyle, borderRadius }: PreviewCardProps) {
  const cardClasses = cardStyle === "elevated" 
    ? "shadow-2xl" 
    : cardStyle === "outlined"
    ? "border-2 border-gray-200"
    : ""

  return (
    <div
      className={`bg-white/95 backdrop-blur-lg overflow-hidden transform transition-all duration-300 hover:scale-105 flex flex-col h-full ${cardClasses}`}
      style={{ borderRadius: `${borderRadius}px` }}
    >
      <div 
        className="relative h-80 overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: primaryColor + "15" }}
      >
        <svg
          className="w-32 h-32"
          style={{ color: primaryColor }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
          />
        </svg>
        
        <div 
          className="absolute top-4 left-4 backdrop-blur-sm text-white px-4 py-2 font-semibold"
          style={{ 
            backgroundColor: primaryColor + "90",
            borderRadius: `${borderRadius}px`
          }}
        >
          Category
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-3xl font-bold text-gray-900 mb-3">
          Product {id}
        </h3>
        
        <p className="text-xl text-gray-600 mb-6 flex-grow">
          High-quality product description with detailed information
        </p>

        <div className="mt-auto">
          <div className="text-5xl font-bold text-gray-900">
            ${299 + id * 50}.99
          </div>
        </div>
      </div>
    </div>
  )
}

