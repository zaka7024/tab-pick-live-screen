export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  price: number;
  currency: string;
  organizationId: string;
  imageUrl: string;
}

export interface ProductRecommendationEvent {
  type: 'products';
  products: Product[];
}

