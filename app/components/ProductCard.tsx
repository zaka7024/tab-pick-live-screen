import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const currency = product.currency || '$';
  const hasDiscount = product.discount && product.discount > 0;
  const discountedPrice = hasDiscount
    ? product.price - (product.price * (product.discount! / 100))
    : product.price;

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105 flex flex-col h-full">
      <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
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
        )}
        
        {product.category && (
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
            {product.category}
          </div>
        )}
        
        {hasDiscount && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-5 py-2 rounded-full text-xl font-bold shadow-lg">
            -{product.discount}%
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
          {hasDiscount ? (
            <div className="flex items-center gap-4">
              <span className="text-2xl text-gray-400 line-through">
                {currency}{product.price.toFixed(2)}
              </span>
              <span className="text-5xl font-bold text-green-600">
                {currency}{discountedPrice.toFixed(2)}
              </span>
            </div>
          ) : (
            <div className="text-5xl font-bold text-gray-900">
              {currency}{product.price.toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

