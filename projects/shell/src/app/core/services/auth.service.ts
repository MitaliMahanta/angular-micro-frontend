import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import { User } from '../../shared/models/user.model';
import { AppState } from '../../store/app.state';
import { AuthActions } from '../../store/auth/auth.actions';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private store = inject(Store<AppState>);
  
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';

  initializeAuth(): void {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    
    if (token && user) {
      this.store.dispatch(AuthActions.loginSuccess({ user, token }));
    }
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Mock authentication - replace with real API call
    return this.mockLogin(credentials).pipe(
      tap(response => {
        this.storeAuthData(response);
        this.store.dispatch(AuthActions.loginSuccess({ 
          user: response.user, 
          token: response.token 
        }));
      }),
      catchError(error => {
        this.store.dispatch(AuthActions.loginFailure({ error: error.message }));
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.clearAuthData();
    this.store.dispatch(AuthActions.logout());
  }

  refreshToken(): Observable<string> {
    const refreshToken = localStorage.getItem(this.REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    // Mock refresh - replace with real API call
    return of('new_mock_token').pipe(
      tap(newToken => {
        localStorage.setItem(this.TOKEN_KEY, newToken);
      })
    );
  }

  private mockLogin(credentials: LoginCredentials): Observable<AuthResponse> {
    // Mock authentication logic
    if (credentials.email === 'admin@example.com' && credentials.password === 'password') {
      const mockUser: User = {
        id: '1',
        email: credentials.email,
        name: 'Admin User',
        role: 'admin' as any
      };
      
      const mockResponse: AuthResponse = {
        user: mockUser,
        token: 'mock_jwt_token_' + Date.now(),
        refreshToken: 'mock_refresh_token_' + Date.now()
      };
      
      return of(mockResponse);
    }
    
    return throwError(() => new Error('Invalid credentials'));
  }

  private storeAuthData(authResponse: AuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, authResponse.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, authResponse.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(authResponse.user));
  }

  private clearAuthData(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  private getStoredToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  private getStoredUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  getToken(): string | null {
    return this.getStoredToken();
  }
}