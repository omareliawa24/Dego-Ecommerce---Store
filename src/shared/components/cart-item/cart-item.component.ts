import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../core/services/cart.service';

/**
 * CartItemComponent - Reusable standalone component
 * Displays a single cart item with quantity controls and remove button
 *
 * Usage:
 * <app-cart-item
 *   [item]="cartItem"
 *   (onIncrease)="handleIncrease($event)"
 *   (onDecrease)="handleDecrease($event)"
 *   (onRemove)="handleRemove($event)">
 * </app-cart-item>
 */
@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CartItemComponent {
  /**
   * Cart item data to display
   */
  @Input() item!: CartItem;

  /**
   * Event emitted when quantity is increased
   */
  @Output() onIncrease = new EventEmitter<number>();

  /**
   * Event emitted when quantity is decreased
   */
  @Output() onDecrease = new EventEmitter<number>();

  /**
   * Event emitted when item is removed
   */
  @Output() onRemove = new EventEmitter<number>();

  /**
   * Calculate subtotal for this item
   */
  getSubtotal(): number {
    return this.item.price * this.item.quantity;
  }

  /**
   * Handle quantity increase
   */
  increaseQuantity(): void {
    this.onIncrease.emit(this.item.id);
  }

  /**
   * Handle quantity decrease
   */
  decreaseQuantity(): void {
    this.onDecrease.emit(this.item.id);
  }

  /**
   * Handle item removal
   */
  removeItem(): void {
    this.onRemove.emit(this.item.id);
  }

  /**
   * Get formatted price string
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }
}
