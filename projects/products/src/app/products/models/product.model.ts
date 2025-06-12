export interface Product {
  id: string;
  name: string;
  sku: string;
  description?: string;
  category: string;
  price: number;
  stock: number;
  status: 'Active' | 'Inactive' | 'Discontinued';
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  imageUrl?: string;
}

export interface ProductFilter {
  search?: string;
  category?: string;
  status?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

export interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}