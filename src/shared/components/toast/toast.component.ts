import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(60px) scale(0.9)' }),
        animate('350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          style({ opacity: 1, transform: 'translateX(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('250ms cubic-bezier(0.4, 0, 1, 1)',
          style({ opacity: 0, transform: 'translateX(60px) scale(0.9)' }))
      ])
    ])
  ]
})
export class ToastComponent implements OnInit {
  toasts: Toast[] = [];

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  /** Icon path per type */
  getIcon(type: string): string {
    const icons: Record<string, string> = {
      success: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      error:   'M10 14l4-4m0 0l-4-4m4 4H3m9 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1',
      info:    'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
    };
    return icons[type] ?? icons['info'];
  }

  /** Friendly title per type */
  getTitle(type: string): string {
    const titles: Record<string, string> = {
      success: 'Success',
      error:   'Error',
      info:    'Info',
      warning: 'Warning'
    };
    return titles[type] ?? 'Notification';
  }

  /** Close toast manually */
  closeToast(id: string): void {
    this.toastService.remove(id);
  }
}
