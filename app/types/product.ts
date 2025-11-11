export enum ProductStatus {
  Draft = 'draft',
  Published = 'published',
  Archived = 'archived',
}

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
  status: ProductStatus;
}

export interface ProductRecommendationEvent {
  type: 'products';
  products: Product[];
}

