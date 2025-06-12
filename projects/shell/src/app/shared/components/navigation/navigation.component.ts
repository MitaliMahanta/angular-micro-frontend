import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

interface NavigationItem {
  label: string;
  route: string;
  icon: string;
  badge?: number;
  children?: NavigationItem[];
}

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatDividerModule
  ],
  template: `
    <nav class="navigation" role="navigation" aria-label="Main navigation">
      <mat-nav-list>
        <h3 matSubheader>Main Menu</h3>
        
        <mat-list-item 
          *ngFor="let item of navigationItems" 
          [routerLink]="item.route"
          routerLinkActive="active"
          (click)="navigationClick.emit()"
          [attr.aria-label]="item.label">
          <mat-icon matListItemIcon [attr.aria-hidden]="true">{{ item.icon }}</mat-icon>
          <span matListItemTitle>{{ item.label }}</span>
          <span *ngIf="item.badge" class="nav-badge" matListItemMeta>{{ item.badge }}</span>
        </mat-list-item>
        
        <mat-divider></mat-divider>
        
        <h3 matSubheader>Modules</h3>
        
        <mat-list-item 
          *ngFor="let module of moduleItems" 
          [routerLink]="module.route"
          routerLinkActive="active"
          (click)="navigationClick.emit()"
          [attr.aria-label]="module.label">
          <mat-icon matListItemIcon [attr.aria-hidden]="true">{{ module.icon }}</mat-icon>
          <span matListItemTitle>{{ module.label }}</span>
          <span *ngIf="module.badge" class="nav-badge" matListItemMeta>{{ module.badge }}</span>
        </mat-list-item>
      </mat-nav-list>
    </nav>
  `,
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  @Output() navigationClick = new EventEmitter<void>();

  navigationItems: NavigationItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Analytics', route: '/analytics', icon: 'analytics' },
    { label: 'Reports', route: '/reports', icon: 'assessment' }
  ];

  moduleItems: NavigationItem[] = [
    { label: 'Products', route: '/products', icon: 'inventory', badge: 12 },
    { label: 'Orders', route: '/orders', icon: 'shopping_cart', badge: 5 },
    { label: 'Users', route: '/users', icon: 'people', badge: 8 }
  ];
}