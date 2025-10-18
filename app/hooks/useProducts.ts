import useSWR from 'swr';
import { Product } from '@/app/types/product';

interface ProductsResponse {
  payload: Product[];
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  const data: ProductsResponse = await response.json();
  return data.payload;
};

export function useProducts() {
  const { data, error, isLoading, mutate } = useSWR<Product[]>(
    '/api/products',
    fetcher,
  );

  return {
    products: data,
    isLoading,
    isError: error,
    mutate,
  };
}
