import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Toast notification types
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

/**
 * Toast notification interface
 */
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number; // milliseconds (default: 3000)
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = new BehaviorSubject<Toast[]>([]);
  public toasts$: Observable<Toast[]> = this.toasts.asObservable();

  private toastCounter = 0;

  /**
   * Show a toast notification
   * @param message - The message to display
   * @param type - Type of notification (success, error, info, warning)
   * @param duration - How long to display in milliseconds (default: 3000ms)
   */
  show(message: string, type: ToastType = 'info', duration: number = 3000): string {
    // Generate unique ID for the toast
    const id = `toast-${++this.toastCounter}`;

    // Create new toast
    const toast: Toast = {
      id,
      message,
      type,
      duration
    };

    // Add to toasts array
    const currentToasts = this.toasts.value;
    this.toasts.next([...currentToasts, toast]);

    // Auto-remove after duration (if duration > 0)
    if (duration > 0) {
      setTimeout(() => {
        this.remove(id);
      }, duration);
    }

    return id;
  }

  /**
   * Show success notification
   */
  success(message: string, duration: number = 3000): string {
    return this.show(message, 'success', duration);
  }

  /**
   * Show error notification
   */
  error(message: string, duration: number = 3000): string {
    return this.show(message, 'error', duration);
  }

  /**
   * Show info notification
   */
  info(message: string, duration: number = 3000): string {
    return this.show(message, 'info', duration);
  }

  /**
   * Show warning notification
   */
  warning(message: string, duration: number = 3000): string {
    return this.show(message, 'warning', duration);
  }

  /**
   * Remove a specific toast by ID
   */
  remove(id: string): void {
    const currentToasts = this.toasts.value;
    const filtered = currentToasts.filter(toast => toast.id !== id);
    this.toasts.next(filtered);
  }

  /**
   * Remove all toasts
   */
  removeAll(): void {
    this.toasts.next([]);
  }

  /**
   * Get current toasts
   */
  getToasts(): Toast[] {
    return this.toasts.value;
  }
}
