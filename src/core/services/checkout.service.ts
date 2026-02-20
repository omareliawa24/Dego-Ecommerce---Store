import { Injectable } from '@angular/core';
import { CartState } from './cart.service';
import { Observable, of } from 'rxjs';

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export interface Order {
  id: string;
  items: any[];
  subtotal: number;
  discountAmount: number;
  tax: number;
  shippingCost: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: 'cash' | 'card';
  paymentStatus?: 'pending' | 'paid' | 'failed';
  createdAt: string;
  transactionId?: string;
}

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly ORDERS_KEY = 'app_orders_v1';

  private cartSnapshot: CartState | null = null;
  private pendingOrder: Order | null = null;

  constructor() {}

  setCartSnapshot(state: CartState) {
    this.cartSnapshot = state;
  }

  getCartSnapshot(): CartState | null {
    return this.cartSnapshot;
  }

  setPendingOrder(order: Order) {
    this.pendingOrder = order;
  }

  getPendingOrder(): Order | null {
    return this.pendingOrder;
  }

  createOrder(order: Order): Observable<Order> {
    const orders = this.loadOrders();
    const newOrder = { ...order, id: this.generateId(), createdAt: new Date().toISOString() };
    orders.unshift(newOrder);
    try {
      localStorage.setItem(this.ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
    this.pendingOrder = null;
    return of(newOrder);
  }

  getOrders(): Order[] {
    return this.loadOrders();
  }

  private loadOrders(): Order[] {
    try {
      const raw = localStorage.getItem(this.ORDERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error('Failed to load orders', e);
      return [];
    }
  }

  private generateId(): string {
    return 'ord_' + Math.random().toString(36).slice(2, 9);
  }
}
