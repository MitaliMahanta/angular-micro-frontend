import { createSelector } from '@ngrx/store';
import { AppState } from './app.state';
import { selectAuthState } from './auth/auth.selectors';

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (authState) => authState.isAuthenticated
);

export const selectCurrentUser = createSelector(
  selectAuthState,
  (authState) => authState.user
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (authState) => authState.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (authState) => authState.error
);