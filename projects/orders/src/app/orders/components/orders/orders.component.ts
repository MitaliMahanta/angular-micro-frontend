import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Order, OrderStatus } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['orderNumber', 'customer', 'items', 'total', 'status', 'orderDate', 'actions'];
  dataSource = new MatTableDataSource<Order>();
  searchControl = new FormControl('');
  statusFilter = new FormControl('');
  loading = false;

  orderStatuses = Object.values(OrderStatus);

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadOrders();
    this.setupFilters();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadOrders() {
    this.loading = true;
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.dataSource.data = orders;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.loading = false;
      }
    });
  }

  setupFilters() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.applyFilter();
      });

    this.statusFilter.valueChanges.subscribe(() => {
      this.applyFilter();
    });
  }

  applyFilter() {
    const searchValue = this.searchControl.value || '';
    const statusValue = this.statusFilter.value || '';
    
    this.dataSource.filterPredicate = (data: Order, filter: string) => {
      const searchMatch = !searchValue || 
        data.orderNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
        data.customerName.toLowerCase().includes(searchValue.toLowerCase()) ||
        data.customerEmail.toLowerCase().includes(searchValue.toLowerCase());
      
      const statusMatch = !statusValue || data.status === statusValue;
      
      return searchMatch && statusMatch;
    };
    
    this.dataSource.filter = searchValue + statusValue;
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getStatusColor(status: OrderStatus): string {
    switch (status) {
      case OrderStatus.PENDING: return 'warn';
      case OrderStatus.CONFIRMED: return 'primary';
      case OrderStatus.PROCESSING: return 'accent';
      case OrderStatus.SHIPPED: return 'primary';
      case OrderStatus.DELIVERED: return 'primary';
      case OrderStatus.CANCELLED: return 'warn';
      case OrderStatus.REFUNDED: return 'warn';
      default: return '';
    }
  }

  updateOrderStatus(order: Order, newStatus: OrderStatus) {
    this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error updating order status:', error);
      }
    });
  }

  cancelOrder(order: Order) {
    if (confirm(`Are you sure you want to cancel order ${order.orderNumber}?`)) {
      this.orderService.cancelOrder(order.id).subscribe({
        next: () => {
          this.loadOrders();
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
        }
      });
    }
  }

  getTotalItems(order: Order): number {
    return order.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}