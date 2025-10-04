export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  imageUrl?: string;
  category?: string;
  discount?: number;
}

export interface ProductRecommendationEvent {
  type: 'products';
  products: Product[];
}

