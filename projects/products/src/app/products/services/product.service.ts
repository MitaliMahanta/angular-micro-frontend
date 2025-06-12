import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Product, ProductFilter, ProductResponse } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = '/api/products';
  
  // Mock data for demonstration
  private mockProducts: Product[] = [
    {
      id: '1',
      name: 'iPhone 15 Pro',
      sku: 'IPHONE-15-PRO',
      description: 'Latest iPhone with advanced camera system',
      category: 'Electronics',
      price: 999.99,
      stock: 25,
      status: 'Active',
      tags: ['smartphone', 'apple', 'premium'],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24',
      sku: 'GALAXY-S24',
      description: 'Flagship Android smartphone',
      category: 'Electronics',
      price: 899.99,
      stock: 15,
      status: 'Active',
      tags: ['smartphone', 'samsung', 'android'],
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-18')
    },
    {
      id: '3',
      name: 'MacBook Pro 16"',
      sku: 'MBP-16-M3',
      description: 'Professional laptop with M3 chip',
      category: 'Electronics',
      price: 2499.99,
      stock: 8,
      status: 'Active',
      tags: ['laptop', 'apple', 'professional'],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '4',
      name: 'Nike Air Max 270',
      sku: 'NIKE-AM-270',
      description: 'Comfortable running shoes',
      category: 'Sports',
      price: 149.99,
      stock: 45,
      status: 'Active',
      tags: ['shoes', 'nike', 'running'],
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-22')
    },
    {
      id: '5',
      name: 'Vintage Denim Jacket',
      sku: 'VDJ-001',
      description: 'Classic vintage style denim jacket',
      category: 'Clothing',
      price: 79.99,
      stock: 3,
      status: 'Active',
      tags: ['jacket', 'denim', 'vintage'],
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-16')
    },
    {
      id: '6',
      name: 'Wireless Headphones',
      sku: 'WH-1000XM5',
      description: 'Noise-canceling wireless headphones',
      category: 'Electronics',
      price: 299.99,
      stock: 0,
      status: 'Inactive',
      tags: ['headphones', 'wireless', 'noise-canceling'],
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-14')
    }
  ];

  constructor(private http: HttpClient) {}

  getProducts(filter?: ProductFilter): Observable<Product[]> {
    // In a real app, this would make an HTTP request
    // return this.http.get<ProductResponse>(`${this.apiUrl}`, { params: this.buildParams(filter) });
    
    // Mock implementation
    let filteredProducts = [...this.mockProducts];
    
    if (filter?.search) {
      const searchTerm = filter.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.sku.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filter?.category) {
      filteredProducts = filteredProducts.filter(product => 
        product.category === filter.category
      );
    }
    
    if (filter?.status) {
      filteredProducts = filteredProducts.filter(product => 
        product.status === filter.status
      );
    }
    
    return of(filteredProducts).pipe(delay(500)); // Simulate network delay
  }

  getProduct(id: string): Observable<Product> {
    // return this.http.get<Product>(`${this.apiUrl}/${id}`);
    
    const product = this.mockProducts.find(p => p.id === id);
    return of(product!).pipe(delay(300));
  }

  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    // return this.http.post<Product>(this.apiUrl, product);
    
    const newProduct: Product = {
      ...product,
      id: (this.mockProducts.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.mockProducts.push(newProduct);
    return of(newProduct).pipe(delay(500));
  }

  updateProduct(id: string, product: Partial<Product>): Observable<Product> {
    // return this.http.put<Product>(`${this.apiUrl}/${id}`, product);
    
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockProducts[index] = {
        ...this.mockProducts[index],
        ...product,
        updatedAt: new Date()
      };
      return of(this.mockProducts[index]).pipe(delay(500));
    }
    
    throw new Error('Product not found');
  }

  deleteProduct(id: string): Observable<void> {
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);
    
    const index = this.mockProducts.findIndex(p => p.id === id);
    if (index !== -1) {
      this.mockProducts.splice(index, 1);
    }
    
    return of(void 0).pipe(delay(300));
  }

  private buildParams(filter?: ProductFilter): HttpParams {
    let params = new HttpParams();
    
    if (filter) {
      Object.keys(filter).forEach(key => {
        const value = (filter as any)[key];
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }
    
    return params;
  }
}