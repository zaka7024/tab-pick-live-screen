import { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { ImageOrientation } from '../types/settings';
import ProductCard from './ProductCard';

interface ProductCarouselProps {
  products: Product[];
  intervalMs?: number;
  orientation?: ImageOrientation;
}

export default function ProductCarousel({ 
  products, 
  intervalMs = 5000,
  orientation = ImageOrientation.Landscape 
}: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (products.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [products.length, intervalMs]);

  // Reset to first product when products change
  useEffect(() => {
    setCurrentIndex(0);
  }, [products]);

  if (products.length === 0) {
    return null;
  }

  const currentProduct = products[currentIndex];

  const isPortrait = orientation === ImageOrientation.Portrait;

  return (
    <div className={`relative ${isPortrait ? 'max-w-3xl mx-auto' : 'w-full'}`}>
      {/* Product Display */}
      <div className="w-full">
        <ProductCard 
          product={currentProduct} 
          isFullScreen 
          orientation={orientation}
        />
      </div>

      {/* <div className="flex justify-center gap-3 mt-8">
        {products.map((_, index) => (
          <div
            key={index}
            className="relative h-2 w-16 bg-white/30 rounded-full overflow-hidden"
          >
            <div
              className={`h-full bg-white rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-full animate-progress' : 'w-0'
              }`}
              style={{
                animation: index === currentIndex ? `progress ${intervalMs}ms linear` : 'none',
              }}
            />
          </div>
        ))}
      </div> */}

      {/* <div className="text-center mt-6">
        <span className="text-4xl font-semibold text-white/80">
          {currentIndex + 1} / {products.length}
        </span>
      </div> */}

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

