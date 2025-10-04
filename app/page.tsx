'use client';

import { useState, useEffect } from 'react';
import { useSocketIO } from './hooks/useWebSocket';
import { Product, ProductRecommendationEvent } from './types/product';
import ProductCarousel from './components/ProductCarousel';
import ConnectionStatus from './components/ConnectionStatus';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  
  // const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000';
  const SOCKET_URL = "https://tab-pick-live-production.up.railway.app";

  const { isConnected, connectionError, on, off } = useSocketIO({
    url: SOCKET_URL,
    reconnectionDelay: 5000,
  });

  useEffect(() => {
    const handleProducts = (data: ProductRecommendationEvent) => {
      console.log('Received products:', data);
      try {
        setProducts(data.products);
      } catch (error) {
        console.error('Failed to process products:', error);
      }
    };

    on<ProductRecommendationEvent>('product-recommendations', handleProducts);

    return () => {
      off<ProductRecommendationEvent>('product-recommendations', handleProducts);
    };
  }, [on, off]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#042F6A] to-[#4EB2F1] p-8 lg:p-12 flex flex-col">
      <ConnectionStatus isConnected={isConnected} error={connectionError} />
      {products.length > 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <ProductCarousel products={products} intervalMs={5000} />
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-16 text-center max-w-2xl">
            <div className="mb-8">
              <svg
                className="w-32 h-32 mx-auto text-gray-400 animate-pulse"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-5xl font-bold text-gray-800 mb-4">
              Waiting for Products
            </h2>
            <p className="text-3xl text-gray-600">
              Product recommendations will appear here once received
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
