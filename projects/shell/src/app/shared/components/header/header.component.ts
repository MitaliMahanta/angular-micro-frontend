import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule
  ],
  template: `
    <mat-toolbar class="header-toolbar" color="primary">
      <button 
        mat-icon-button 
        (click)="menuToggle.emit()"
        matTooltip="Toggle Menu"
        aria-label="Toggle navigation menu">
        <mat-icon>menu</mat-icon>
      </button>
      
      <span class="app-title">Enterprise Portal</span>
      
      <div class="header-spacer"></div>
      
      <div class="header-actions">
        <button 
          mat-icon-button 
          matTooltip="Notifications"
          [matBadge]="notificationCount"
          matBadgeColor="warn"
          [matBadgeHidden]="notificationCount === 0"
          aria-label="View notifications">
          <mat-icon>notifications</mat-icon>
        </button>
        
        <button 
          mat-icon-button 
          [matMenuTriggerFor]="userMenu"
          matTooltip="User Menu"
          aria-label="User account menu">
          <mat-icon>account_circle</mat-icon>
        </button>
        
        <mat-menu #userMenu="matMenu" xPosition="before">
          <div class="user-info" mat-menu-item disabled>
            <div class="user-details">
              <strong>{{ user?.name || 'User' }}</strong>
              <small>{{ user?.email }}</small>
            </div>
          </div>
          <mat-divider></mat-divider>
          <button mat-menu-item>
            <mat-icon>person</mat-icon>
            <span>Profile</span>
          </button>
          <button mat-menu-item>
            <mat-icon>settings</mat-icon>
            <span>Settings</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logout.emit()">
            <mat-icon>exit_to_app</mat-icon>
            <span>Logout</span>
          </button>
        </mat-menu>
      </div>
    </mat-toolbar>
  `,
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() user: User | null = null;
  @Output() menuToggle = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  notificationCount = 3; // Mock notification count
}