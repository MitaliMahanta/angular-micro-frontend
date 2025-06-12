import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import { AuthActions } from './auth/auth.actions';

@Injectable()
export class AppEffects {
  constructor(private actions$: Actions) {}

  // Add global effects here if needed
}