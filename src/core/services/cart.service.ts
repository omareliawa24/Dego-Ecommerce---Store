import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

/**
 * Cart item interface with full pricing information
 * Represents a product in the shopping cart with calculated subtotal
 */
export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  subtotal?: number; // Price * Quantity (calculated)
}

/**
 * Discount interface for cart promotions
 * Supports both percentage and fixed amount discounts
 */
export interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  maxDiscount?: number; // Maximum discount for percentage types
  minAmount?: number;   // Minimum cart total to apply discount
  applied: boolean;
  expiryDate?: Date;
}

/**
 * Complete cart state snapshot
 * Contains all cart-related calculations for UI display
 */
export interface CartState {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  discount: Discount | null;
  discountAmount: number;
  tax: number;
  taxRate: number;
  shippingCost: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Storage keys for persistence
  private readonly STORAGE_KEY = 'shopping_cart';
  private readonly DISCOUNT_KEY = 'cart_discount';

  // State management with BehaviorSubjects for reactive updates
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  private discount = new BehaviorSubject<Discount | null>(null);
  private cartState = new BehaviorSubject<CartState>(this.getEmptyCartState());

  // Configuration - easily customizable
  private readonly TAX_RATE = 0.10; // 10% tax rate
  private readonly SHIPPING_COST = 10; // Fixed shipping cost
  private readonly FREE_SHIPPING_THRESHOLD = 100; // Free shipping over $100

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadCart();
    this.loadDiscount();
    this.updateCartState(); // Initial state calculation
  }

  // ============ PUBLIC OBSERVABLES ============

  /**
   * Observable for all cart items - use with async pipe
   */
  getCartItems$(): Observable<CartItem[]> {
    return this.cartItems.asObservable();
  }

  /**
   * Observable for applied discount
   */
  getDiscount$(): Observable<Discount | null> {
    return this.discount.asObservable();
  }

  /**
   * Observable for complete cart state (items, totals, calculations)
   */
  getCartState$(): Observable<CartState> {
    return this.cartState.asObservable();
  }

  /**
   * Observable for cart subtotal (before tax and discount)
   */
  getSubtotal$(): Observable<number> {
    return this.cartState.pipe(map(state => state.subtotal));
  }

  /**
   * Observable for total price (final amount with all calculations)
   */
  getTotal$(): Observable<number> {
    return this.cartState.pipe(map(state => state.total));
  }

  /**
   * Observable for item count badge
   */
  getItemCount$(): Observable<number> {
    return this.cartState.pipe(map(state => state.itemCount));
  }

  // ============ SNAPSHOT METHODS (for non-reactive access) ============

  /**
   * Get current cart items snapshot
   */
  getCartItems(): CartItem[] {
    return this.cartItems.value;
  }

  /**
   * Get total number of items in cart
   */
  getCartItemCount(): number {
    return this.cartItems.value.reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Get subtotal of all items
   */
  getSubtotal(): number {
    return this.cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  /**
   * Get total price (final amount)
   */
  getTotalPrice(): number {
    return this.cartState.value.total;
  }

  /**
   * Get current cart state snapshot
   */
  getCartState(): CartState {
    return this.cartState.value;
  }

  // ============ CART ITEM MANAGEMENT ============

  /**
   * Add product to cart or increase quantity if exists
   */
  addToCart(product: Omit<CartItem, 'quantity' | 'subtotal'>, quantity: number = 1): void {
    const currentItems = this.cartItems.value;
    const existingItem = currentItems.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ ...product, quantity });
    }

    this.cartItems.next([...currentItems]);
    this.saveCart();
    this.updateCartState();
  }

  /**
   * Remove item from cart completely
   */
  removeFromCart(productId: number): void {
    const filtered = this.cartItems.value.filter(item => item.id !== productId);
    this.cartItems.next(filtered);
    this.saveCart();
    this.updateCartState();
  }

  /**
   * Increase quantity of item by 1
   */
  increaseQuantity(productId: number): void {
    const items = this.cartItems.value;
    const item = items.find(i => i.id === productId);

    if (item) {
      item.quantity++;
      this.cartItems.next([...items]);
      this.saveCart();
      this.updateCartState();
    }
  }

  /**
   * Decrease quantity of item by 1
   * Removes item if quantity reaches 0
   */
  decreaseQuantity(productId: number): void {
    const items = this.cartItems.value;
    const item = items.find(i => i.id === productId);

    if (item) {
      if (item.quantity > 1) {
        item.quantity--;
        this.cartItems.next([...items]);
      } else {
        this.removeFromCart(productId);
        return;
      }
      this.saveCart();
      this.updateCartState();
    }
  }

  /**
   * Set exact quantity for an item (1-999)
   */
  setQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const items = this.cartItems.value;
    const item = items.find(i => i.id === productId);

    if (item) {
      item.quantity = Math.max(1, Math.min(quantity, 999));
      this.cartItems.next([...items]);
      this.saveCart();
      this.updateCartState();
    }
  }

  /**
   * Clear entire cart
   */
  clearCart(): void {
    this.cartItems.next([]);
    this.discount.next(null);
    this.saveCart();
    this.saveDiscount();
    this.updateCartState();
  }

  // ============ DISCOUNT MANAGEMENT ============

  /**
   * Apply discount code to cart
   * @returns true if discount applied successfully
   */
  applyDiscount(code: string): boolean {
    // Mock discount validation - replace with API call
    const validDiscount = this.validateDiscountCode(code);

    if (!validDiscount) {
      return false;
    }

    const subtotal = this.getSubtotal();
    if (validDiscount.minAmount && subtotal < validDiscount.minAmount) {
      console.warn(`Minimum cart total of $${validDiscount.minAmount} required`);
      return false;
    }

    validDiscount.applied = true;
    this.discount.next(validDiscount);
    this.saveDiscount();
    this.updateCartState();
    return true;
  }

  /**
   * Remove applied discount from cart
   */
  removeDiscount(): void {
    this.discount.next(null);
    this.saveDiscount();
    this.updateCartState();
  }

  /**
   * Get discount amount for current cart
   */
  getDiscountAmount(): number {
    const disc = this.discount.value;
    if (!disc || !disc.applied) return 0;

    const subtotal = this.getSubtotal();
    if (disc.type === 'percentage') {
      const amount = (subtotal * disc.value) / 100;
      return disc.maxDiscount ? Math.min(amount, disc.maxDiscount) : amount;
    }
    return disc.value;
  }

  // ============ CALCULATION HELPERS ============

  /**
   * Calculate tax for given amount
   */
  calculateTax(amount: number): number {
    return Math.round(amount * this.TAX_RATE * 100) / 100;
  }

  /**
   * Calculate shipping based on subtotal
   */
  calculateShipping(subtotal: number): number {
    return subtotal >= this.FREE_SHIPPING_THRESHOLD ? 0 : this.SHIPPING_COST;
  }

  /**
   * Update complete cart state with all calculations
   */
  private updateCartState(): void {
    const items = this.cartItems.value;
    const subtotal = this.getSubtotal();
    const discountAmount = this.getDiscountAmount();
    const tax = this.calculateTax(subtotal - discountAmount);
    const shipping = this.calculateShipping(subtotal);
    const total = subtotal - discountAmount + tax + shipping;

    const state: CartState = {
      items: items.map(item => ({ ...item, subtotal: item.price * item.quantity })),
      subtotal,
      itemCount: this.getCartItemCount(),
      discount: this.discount.value,
      discountAmount,
      tax,
      taxRate: this.TAX_RATE,
      shippingCost: shipping,
      total: Math.round(total * 100) / 100
    };

    this.cartState.next(state);
  }

  /**
   * Get empty state template
   */
  private getEmptyCartState(): CartState {
    return {
      items: [],
      subtotal: 0,
      itemCount: 0,
      discount: null,
      discountAmount: 0,
      tax: 0,
      taxRate: this.TAX_RATE,
      shippingCost: 0,
      total: 0
    };
  }

  // ============ MOCK DISCOUNT VALIDATION ============

  /**
   * Mock discount code validation
   * TODO: Replace with real API: GET /api/discounts/:code
   */
  private validateDiscountCode(code: string): Discount | null {
    const validCodes: { [key: string]: Discount } = {
      'SAVE10': { id: '1', code: 'SAVE10', type: 'percentage', value: 10, applied: false },
      'FLAT20': { id: '2', code: 'FLAT20', type: 'fixed', value: 20, minAmount: 50, applied: false },
      'SAVE20': { id: '3', code: 'SAVE20', type: 'percentage', value: 20, maxDiscount: 50, applied: false }
    };

    return validCodes[code.toUpperCase()] || null;
  }

  // ============ PERSISTENCE (localStorage) ============

  /**
   * Load cart from localStorage (SSR-safe)
   */
  private loadCart(): void {
    if (!this.isBrowser) return;

    try {
      const savedCart = localStorage.getItem(this.STORAGE_KEY);
      if (savedCart) {
        this.cartItems.next(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      this.cartItems.next([]);
    }
  }

  /**
   * Save cart to localStorage (SSR-safe)
   */
  private saveCart(): void {
    if (!this.isBrowser) return;

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.cartItems.value));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }

  /**
   * Load discount from localStorage
   */
  private loadDiscount(): void {
    if (!this.isBrowser) return;

    try {
      const savedDiscount = localStorage.getItem(this.DISCOUNT_KEY);
      if (savedDiscount) {
        this.discount.next(JSON.parse(savedDiscount));
      }
    } catch (error) {
      console.error('Error loading discount:', error);
    }
  }

  /**
   * Save discount to localStorage
   */
  private saveDiscount(): void {
    if (!this.isBrowser) return;

    try {
      localStorage.setItem(this.DISCOUNT_KEY, JSON.stringify(this.discount.value));
    } catch (error) {
      console.error('Error saving discount:', error);
    }
  }

  // ============ API INTEGRATION READY ============
  /**
   * TODO: Replace mock discount validation with real API
   *
   * applyDiscountAPI(code: string): Observable<Discount> {
   *   return this.http.post<Discount>('/api/discounts/validate', { code })
   *     .pipe(
   *       tap(discount => {
   *         discount.applied = true;
   *         this.discount.next(discount);
   *         this.updateCartState();
   *       })
   *     );
   * }
   *
   * getCheckoutData(): Observable<CartState> {
   *   return this.cartState.asObservable();
   * }
   *
   * submitOrder(order: Order): Observable<OrderResponse> {
   *   return this.http.post<OrderResponse>('/api/orders', order);
   * }
   */
}
