import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule)
  }
];