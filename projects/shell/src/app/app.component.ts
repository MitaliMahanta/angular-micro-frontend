import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { NavigationComponent } from './shared/components/navigation/navigation.component';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { AuthService } from './core/services/auth.service';
import { AppState } from './store/app.state';
import { selectIsAuthenticated, selectCurrentUser } from './store/app.selectors';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    NavigationComponent,
    HeaderComponent,
    FooterComponent
  ],
  template: `
    <div class="app-container" [class.authenticated]="isAuthenticated$ | async">
      <app-header 
        *ngIf="isAuthenticated$ | async"
        [user]="currentUser$ | async"
        (menuToggle)="toggleSidenav()"
        (logout)="logout()">
      </app-header>
      
      <mat-sidenav-container class="sidenav-container" [class.with-header]="isAuthenticated$ | async">
        <mat-sidenav 
          #drawer 
          class="sidenav" 
          fixedInViewport
          [attr.role]="(isAuthenticated$ | async) ? 'dialog' : null"
          [mode]="(isAuthenticated$ | async) ? 'over' : 'side'"
          [opened]="(isAuthenticated$ | async) && sidenavOpened">
          <app-navigation 
            *ngIf="isAuthenticated$ | async"
            (navigationClick)="closeSidenav()">
          </app-navigation>
        </mat-sidenav>
        
        <mat-sidenav-content class="main-content">
          <main class="content-area" role="main">
            <router-outlet></router-outlet>
          </main>
          
          <app-footer *ngIf="isAuthenticated$ | async"></app-footer>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private store = inject(Store<AppState>);
  private authService = inject(AuthService);
  private router = inject(Router);

  isAuthenticated$: Observable<boolean> = this.store.select(selectIsAuthenticated);
  currentUser$ = this.store.select(selectCurrentUser);
  sidenavOpened = false;

  ngOnInit() {
    this.authService.initializeAuth();
  }

  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }

  closeSidenav() {
    this.sidenavOpened = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }
}