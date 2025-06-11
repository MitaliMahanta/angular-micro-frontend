import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';

interface DashboardCard {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  route?: string;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatProgressBarModule
  ],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your business today.</p>
      </header>
      
      <div class="dashboard-grid">
        <mat-card 
          *ngFor="let card of dashboardCards" 
          class="dashboard-card"
          [class]="'card-' + card.color"
          [routerLink]="card.route"
          [style.cursor]="card.route ? 'pointer' : 'default'">
          <mat-card-content>
            <div class="card-header">
              <div class="card-icon">
                <mat-icon>{{ card.icon }}</mat-icon>
              </div>
              <div class="card-change" *ngIf="card.change">
                <mat-icon [class]="'trend-' + card.change.trend">
                  {{ card.change.trend === 'up' ? 'trending_up' : 'trending_down' }}
                </mat-icon>
                <span>{{ card.change.value }}%</span>
              </div>
            </div>
            
            <div class="card-content">
              <h2>{{ card.value }}</h2>
              <p>{{ card.title }}</p>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <div class="dashboard-charts">
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>Recent Activity</mat-card-title>
            <mat-card-subtitle>Last 7 days</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="activity-list">
              <div *ngFor="let activity of recentActivities" class="activity-item">
                <div class="activity-icon">
                  <mat-icon>{{ activity.icon }}</mat-icon>
                </div>
                <div class="activity-content">
                  <h4>{{ activity.title }}</h4>
                  <p>{{ activity.description }}</p>
                  <small>{{ activity.time }}</small>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="chart-card">
          <mat-card-header>
            <mat-card-title>System Status</mat-card-title>
            <mat-card-subtitle>All systems operational</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="status-list">
              <div *ngFor="let status of systemStatus" class="status-item">
                <div class="status-indicator" [class]="'status-' + status.status"></div>
                <div class="status-content">
                  <h4>{{ status.service }}</h4>
                  <p>{{ status.description }}</p>
                  <mat-progress-bar 
                    mode="determinate" 
                    [value]="status.uptime"
                    [color]="status.status === 'healthy' ? 'primary' : 'warn'">
                  </mat-progress-bar>
                  <small>{{ status.uptime }}% uptime</small>
                </div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  dashboardCards: DashboardCard[] = [
    {
      title: 'Total Products',
      value: '1,234',
      icon: 'inventory',
      color: 'blue',
      route: '/products',
      change: { value: 12, trend: 'up' }
    },
    {
      title: 'Active Orders',
      value: '89',
      icon: 'shopping_cart',
      color: 'green',
      route: '/orders',
      change: { value: 8, trend: 'up' }
    },
    {
      title: 'Total Users',
      value: '2,567',
      icon: 'people',
      color: 'purple',
      route: '/users',
      change: { value: 5, trend: 'down' }
    },
    {
      title: 'Revenue',
      value: '$45,678',
      icon: 'attach_money',
      color: 'orange',
      change: { value: 15, trend: 'up' }
    }
  ];

  recentActivities = [
    {
      title: 'New Order Received',
      description: 'Order #12345 from John Doe',
      time: '2 minutes ago',
      icon: 'shopping_bag'
    },
    {
      title: 'Product Updated',
      description: 'iPhone 15 Pro inventory updated',
      time: '15 minutes ago',
      icon: 'edit'
    },
    {
      title: 'User Registered',
      description: 'New user: jane.smith@example.com',
      time: '1 hour ago',
      icon: 'person_add'
    },
    {
      title: 'System Backup',
      description: 'Daily backup completed successfully',
      time: '2 hours ago',
      icon: 'backup'
    }
  ];

  systemStatus = [
    {
      service: 'Products Service',
      description: 'All product operations running smoothly',
      status: 'healthy',
      uptime: 99.9
    },
    {
      service: 'Orders Service',
      description: 'Order processing active',
      status: 'healthy',
      uptime: 98.5
    },
    {
      service: 'Users Service',
      description: 'User management operational',
      status: 'healthy',
      uptime: 99.2
    },
    {
      service: 'Payment Gateway',
      description: 'Payment processing available',
      status: 'warning',
      uptime: 95.8
    }
  ];

  ngOnInit() {
    // Initialize dashboard data
  }
}