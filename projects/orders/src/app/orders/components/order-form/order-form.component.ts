import { Component } from '@angular/core';

@Component({
  selector: 'app-order-form',
  template: `
    <div class="order-form-container">
      <h2>Create New Order</h2>
      <p>Order form functionality will be implemented here.</p>
    </div>
  `,
  styles: [`
    .order-form-container {
      padding: 24px;
      text-align: center;
    }
  `]
})
export class OrderFormComponent {}