import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  isFullScreen?: boolean;
}

export default function ProductCard({ product, isFullScreen = false }: ProductCardProps) {
  const currency = product.currency;

  if (isFullScreen) {
    return (
      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row w-[1080px] mx-auto min-h-[600px] animate-fade-in">
        {/* Product Image - Left Side */}
        <div className="relative w-[1080px] h-96 lg:h-auto bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-48 h-48 text-gray-400"
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
          </div>
          
          {/* Category Badge */}
          {product.category && (
            <div className="absolute top-8 left-8 bg-black/70 backdrop-blur-sm text-white px-8 py-4 rounded-full text-2xl font-semibold">
              {product.category}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 flex flex-col h-full">
      <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          <svg
            className="w-32 h-32 text-gray-400"
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
        </div>
        
        {product.category && (
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
            {product.category}
          </div>
        )}
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <h3 className="text-3xl font-bold text-gray-900 mb-3 line-clamp-2">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-xl text-gray-600 mb-6 line-clamp-3 flex-grow">
            {product.description}
          </p>
        )}

        <div className="mt-auto">
          <div className="text-5xl font-bold text-gray-900">
            {currency} {product.price.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}

