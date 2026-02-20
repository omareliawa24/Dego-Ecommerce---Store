import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  constructor() {}

  processCardPayment(amount: number): Observable<PaymentResult> {
    const ms = 1500 + Math.floor(Math.random() * 1200);
    const success = Math.random() < 0.85;
    const result: PaymentResult = success
      ? { success: true, transactionId: 'tx_' + Math.random().toString(36).slice(2, 10) }
      : { success: false };

    return of(result).pipe(delay(ms));
  }
}
