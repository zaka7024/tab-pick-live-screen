'use client';

import { useState, useEffect } from 'react';
import { useSocketIO } from './hooks/useWebSocket';
import { Product, ProductRecommendationEvent } from './types/product';
import ProductCard from './components/ProductCard';
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

    on('product-recommendations', handleProducts);

    return () => {
      off('product-recommendations', handleProducts);
    };
  }, [on, off]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-12">
      <ConnectionStatus isConnected={isConnected} error={connectionError} />

      <header className="mb-12 text-center">
        <h1 className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
          Recommended Products
        </h1>
        <p className="text-3xl text-gray-600">
          Discover our top picks just for you
        </p>
      </header>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-[1920px] mx-auto">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-16 text-center">
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
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Waiting for Products
            </h2>
            <p className="text-2xl text-gray-600">
              Product recommendations will appear here once received
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
