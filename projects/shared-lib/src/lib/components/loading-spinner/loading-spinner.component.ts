import { Component, Input } from '@angular/core';

@Component({
  selector: 'lib-loading-spinner',
  template: `
    <div class="loading-container" [style.height]="height">
      
      <mat-spinner [diameter]="diameter" [color]="color"></mat-spinner>
      <p *ngIf="message" class="loading-message">{{ message }}</p>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    
    .loading-message {
      margin-top: 16px;
      color: rgba(0,0,0,0.6);
      font-size: 14px;
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() diameter: number = 40;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
  @Input() message?: string;
  @Input() height: string = 'auto';
}