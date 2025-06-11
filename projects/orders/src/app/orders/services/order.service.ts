import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { Order, OrderStatus, OrderFilter } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = '/api/orders';
  
  // Mock data for demonstration
  private mockOrders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customerId: 'cust-001',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      status: OrderStatus.PROCESSING,
      items: [
        {
          id: '1',
          productId: '1',
          productName: 'iPhone 15 Pro',
          sku: 'IPHONE-15-PRO',
          quantity: 1,
          unitPrice: 999.99,
          total: 999.99
        }
      ],
      subtotal: 999.99,
      tax: 80.00,
      shipping: 15.00,
      total: 1094.99,
      shippingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      billingAddress: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      },
      paymentMethod: {
        type: 'credit_card',
        last4: '4242',
        brand: 'Visa'
      },
      orderDate: new Date('2024-01-15T10:30:00'),
      notes: 'Please handle with care'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customerId: 'cust-002',
      customerName: 'Jane Smith',
      customerEmail: 'jane.smith@example.com',
      status: OrderStatus.SHIPPED,
      items: [
        {
          id: '2',
          productId: '2',
          productName: 'Samsung Galaxy S24',
          sku: 'GALAXY-S24',
          quantity: 1,
          unitPrice: 899.99,
          total: 899.99
        },
        {
          id: '3',
          productId: '4',
          productName: 'Nike Air Max 270',
          sku: 'NIKE-AM-270',
          quantity: 2,
          unitPrice: 149.99,
          total: 299.98
        }
      ],
      subtotal: 1199.97,
      tax: 96.00,
      shipping: 20.00,
      total: 1315.97,
      shippingAddress: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      },
      billingAddress: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      },
      paymentMethod: {
        type: 'credit_card',
        last4: '8888',
        brand: 'Mastercard'
      },
      orderDate: new Date('2024-01-14T14:20:00'),
      shippedDate: new Date('2024-01-16T09:15:00')
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      customerId: 'cust-003',
      customerName: 'Bob Johnson',
      customerEmail: 'bob.johnson@example.com',
      status: OrderStatus.DELIVERED,
      items: [
        {
          id: '4',
          productId: '3',
          productName: 'MacBook Pro 16"',
          sku: 'MBP-16-M3',
          quantity: 1,
          unitPrice: 2499.99,
          total: 2499.99
        }
      ],
      subtotal: 2499.99,
      tax: 200.00,
      shipping: 0.00,
      total: 2699.99,
      shippingAddress: {
        street: '789 Pine St',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        country: 'USA'
      },
      billingAddress: {
        street: '789 Pine St',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        country: 'USA'
      },
      paymentMethod: {
        type: 'paypal'
      },
      orderDate: new Date('2024-01-10T16:45:00'),
      shippedDate: new Date('2024-01-12T11:30:00'),
      deliveredDate: new Date('2024-01-14T15:20:00')
    }
  ];

  constructor(private http: HttpClient) {}

  getOrders(filter?: OrderFilter): Observable<Order[]> {
    let filteredOrders = [...this.mockOrders];
    
    if (filter?.search) {
      const searchTerm = filter.search.toLowerCase();
      filteredOrders = filteredOrders.filter(order =>
        order.orderNumber.toLowerCase().includes(searchTerm) ||
        order.customerName.toLowerCase().includes(searchTerm) ||
        order.customerEmail.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filter?.status) {
      filteredOrders = filteredOrders.filter(order => 
        order.status === filter.status
      );
    }
    
    return of(filteredOrders).pipe(delay(500));
  }

  getOrder(id: string): Observable<Order> {
    const order = this.mockOrders.find(o => o.id === id);
    return of(order!).pipe(delay(300));
  }

  updateOrderStatus(id: string, status: OrderStatus): Observable<Order> {
    const index = this.mockOrders.findIndex(o => o.id === id);
    if (index !== -1) {
      this.mockOrders[index] = {
        ...this.mockOrders[index],
        status
      };
      return of(this.mockOrders[index]).pipe(delay(500));
    }
    
    throw new Error('Order not found');
  }

  cancelOrder(id: string): Observable<Order> {
    return this.updateOrderStatus(id, OrderStatus.CANCELLED);
  }
}