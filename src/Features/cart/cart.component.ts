
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartItem, CartService, CartState, Discount } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { Router } from '@angular/router';
import { CheckoutService } from '../../core/services/checkout.service';
import { CartItemComponent } from '../../shared/components/cart-item/cart-item.component';
import { formatPrice, getAmountUntilFreeShipping, qualifiesForFreeShipping } from '../../utils/cart-helpers';
import { fadeAnimation, slideZoomAnimation } from '../../shared/animations/cart-animations';

/**
 * CartComponent - Shopping cart page
 * Displays all cart items with quantity controls, discount application, and checkout
 * Professional e-commerce layout with responsive design
 */
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, CartItemComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  animations: [fadeAnimation, slideZoomAnimation]
})
export class CartComponent implements OnInit, OnDestroy {
  // Cart data
  cartItems: CartItem[] = [];
  cartState: CartState = this.getEmptyState();
  cartState$: Observable<CartState>;

  // Discount form
  discountCode: string = '';
  appliedDiscount: Discount | null = null;
  discountError: string = '';

  // UI states
  isLoadingCheckout = false;

  private destroy$ = new Subject<void>();

  constructor(
    private cartService: CartService,
    private toastService: ToastService
    ,
    private router: Router,
    private checkoutService: CheckoutService
  ) {
    this.cartState$ = this.cartService.getCartState$();
  }

  ngOnInit(): void {
    // Subscribe to complete cart state
    this.cartState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state: CartState) => {
        this.cartState = state;
        this.cartItems = state.items;
        this.appliedDiscount = state.discount;
      });
  }

  /**
   * Handle quantity increase from child component
   */
  onIncreaseQuantity(productId: number): void {
    this.cartService.increaseQuantity(productId);
  }

  /**
   * Handle quantity decrease from child component
   */
  onDecreaseQuantity(productId: number): void {
    this.cartService.decreaseQuantity(productId);
  }

  /**
   * Handle item removal from child component
   */
  onRemoveItem(productId: number): void {
    const item = this.cartItems.find(i => i.id === productId);
    if (item) {
      this.cartService.removeFromCart(productId);
      this.toastService.show(`${item.title} removed from cart`, 'info', 2000);
    }
  }

  /**
   * Apply discount code to cart
   */
  applyDiscount(): void {
    this.discountError = '';

    if (!this.discountCode.trim()) {
      this.discountError = 'Please enter a discount code';
      return;
    }

    const success = this.cartService.applyDiscount(this.discountCode.trim());

    if (success) {
      this.toastService.show(
        `Discount ${this.discountCode} applied successfully!`,
        'success',
        3000
      );
      this.discountCode = '';
    } else {
      this.discountError = 'Invalid or expired discount code';
      this.toastService.show('Invalid discount code', 'error', 3000);
    }
  }

  /**
   * Remove applied discount
   */
  removeDiscount(): void {
    this.cartService.removeDiscount();
    this.toastService.show('Discount removed', 'info', 2000);
  }

  /**
   * Clear entire cart with confirmation
   */
  clearCart(): void {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      this.cartService.clearCart();
      this.toastService.show('Cart cleared', 'warning', 2000);
    }
  }

  /**
   * Proceed to checkout
   * TODO: Navigate to checkout page with cart data
   */
  proceedToCheckout(): void {
    if (this.cartItems.length === 0) {
      this.toastService.show('Your cart is empty', 'error', 2000);
      return;
    }

    this.isLoadingCheckout = true;
    // Save cart snapshot into CheckoutService for later use (optional)
    this.checkoutService.setCartSnapshot(this.cartState);

    // navigate to checkout page
    this.router.navigate(['/checkout']).finally(() => {
      this.isLoadingCheckout = false;
    });
  }

  /**
   * Get amount needed for free shipping
   */
  getAmountForFreeShipping(): number {
    return getAmountUntilFreeShipping(this.cartState.subtotal);
  }

  /**
   * Check if free shipping qualifies
   */
  hasFreeShipping(): boolean {
    return qualifiesForFreeShipping(this.cartState.subtotal);
  }

  /**
   * Format price helper
   */
  formatPrice = formatPrice;

  /**
   * Get empty cart state
   */
  private getEmptyState(): CartState {
    return {
      items: [],
      subtotal: 0,
      itemCount: 0,
      discount: null,
      discountAmount: 0,
      tax: 0,
      taxRate: 0.10,
      shippingCost: 0,
      total: 0
    };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
