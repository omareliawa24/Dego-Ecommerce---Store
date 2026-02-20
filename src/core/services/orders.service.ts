import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ShippingPayload {
  shippingAddress: {
    details: string;
    phone: string;
    city: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private readonly API_BASE = '/api/v1/orders';

  constructor(private http: HttpClient) {}

  /**
   * Create order for Cash on Delivery
   * POST /api/v1/orders/{cartId}
   */
  createOrderCash(cartId: string, payload: ShippingPayload): Observable<any> {
    const url = `${this.API_BASE}/${encodeURIComponent(cartId)}`;
    return this.http.post(url, payload);
  }

  /**
   * Create checkout session for card payments
   * POST /api/v1/orders/checkout-session/{cartId}?url={returnUrl}
   * Expects the API to return an object containing the payment url (e.g. { url: 'https://...' })
   */
  createCheckoutSession(cartId: string, payload: ShippingPayload, returnUrl: string): Observable<any> {
    const url = `${this.API_BASE}/checkout-session/${encodeURIComponent(cartId)}`;
    const params = new HttpParams().set('url', returnUrl);
    return this.http.post(url, payload, { params });
  }
}
