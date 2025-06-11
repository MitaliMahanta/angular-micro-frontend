import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export interface NotificationConfig extends MatSnackBarConfig {
  type?: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'right',
    verticalPosition: 'top'
  };

  constructor(private snackBar: MatSnackBar) {}

  show(message: string, action?: string, config?: NotificationConfig): void {
    const finalConfig = { ...this.defaultConfig, ...config };
    
    if (config?.type) {
      finalConfig.panelClass = [`${config.type}-snackbar`];
    }

    this.snackBar.open(message, action, finalConfig);
  }

  success(message: string, action?: string, config?: MatSnackBarConfig): void {
    this.show(message, action, { ...config, type: 'success' });
  }

  error(message: string, action?: string, config?: MatSnackBarConfig): void {
    this.show(message, action, { ...config, type: 'error' });
  }

  warning(message: string, action?: string, config?: MatSnackBarConfig): void {
    this.show(message, action, { ...config, type: 'warning' });
  }

  info(message: string, action?: string, config?: MatSnackBarConfig): void {
    this.show(message, action, { ...config, type: 'info' });
  }

  dismiss(): void {
    this.snackBar.dismiss();
  }
}