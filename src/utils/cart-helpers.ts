/**
 * Cart Helper Functions
 * Utility functions for cart operations and calculations
 * These are pure functions that can be used across the application
 */

/**
 * Format price to currency string
 * @param price - Price amount in dollars
 * @param currency - Currency code (default: USD)
 * @returns Formatted price string (e.g., "$19.99")
 */
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

/**
 * Format currency for display (without $ symbol)
 * @param price - Price amount
 * @returns Currency formatted number (e.g., "19.99")
 */
export function formatCurrency(price: number): string {
  return price.toFixed(2);
}

/**
 * Calculate subtotal for cart items
 * @param items - Array of cart items
 * @returns Subtotal amount
 */
export function calculateSubtotal(items: any[]): number {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Calculate total item count
 * @param items - Array of cart items
 * @returns Total quantity of all items
 */
export function calculateItemCount(items: any[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

/**
 * Calculate discount amount
 * @param subtotal - Cart subtotal
 * @param discountType - 'percentage' or 'fixed'
 * @param discountValue - Discount value (percentage or fixed amount)
 * @param maxDiscount - Maximum discount cap (for percentages)
 * @returns Discount amount in dollars
 */
export function calculateDiscount(
  subtotal: number,
  discountType: 'percentage' | 'fixed',
  discountValue: number,
  maxDiscount?: number
): number {
  if (discountType === 'percentage') {
    const amount = (subtotal * discountValue) / 100;
    return maxDiscount ? Math.min(amount, maxDiscount) : amount;
  }
  return discountValue;
}

/**
 * Calculate tax amount
 * @param amount - Amount to calculate tax on
 * @param taxRate - Tax rate as decimal (0.10 = 10%)
 * @returns Tax amount
 */
export function calculateTax(amount: number, taxRate: number = 0.10): number {
  return Math.round(amount * taxRate * 100) / 100;
}

/**
 * Calculate shipping cost
 * @param subtotal - Cart subtotal
 * @param shippingCost - Fixed shipping cost
 * @param freeShippingThreshold - Subtotal amount for free shipping
 * @returns Shipping cost (0 if qualifies for free shipping)
 */
export function calculateShipping(
  subtotal: number,
  shippingCost: number = 10,
  freeShippingThreshold: number = 100
): number {
  return subtotal >= freeShippingThreshold ? 0 : shippingCost;
}

/**
 * Calculate final total
 * @param subtotal - Cart subtotal
 * @param discount - Discount amount
 * @param tax - Tax amount
 * @param shipping - Shipping cost
 * @returns Final total amount
 */
export function calculateTotal(
  subtotal: number,
  discount: number,
  tax: number,
  shipping: number
): number {
  return Math.round((subtotal - discount + tax + shipping) * 100) / 100;
}

/**
 * Validate quantity input
 * @param quantity - Quantity to validate
 * @param min - Minimum allowed quantity (default: 1)
 * @param max - Maximum allowed quantity (default: 999)
 * @returns Validated quantity
 */
export function validateQuantity(
  quantity: number,
  min: number = 1,
  max: number = 999
): number {
  const num = Math.floor(quantity);
  return Math.max(min, Math.min(num, max));
}

/**
 * Check if discount code is valid format
 * @param code - Discount code to validate
 * @returns True if format is valid
 */
export function isValidDiscountCode(code: string): boolean {
  // Alphanumeric, 3-20 characters
  const pattern = /^[A-Z0-9]{3,20}$/i;
  return pattern.test(code.trim());
}

/**
 * Get discount message
 * @param discountValue - Discount value
 * @param discountType - 'percentage' or 'fixed'
 * @returns Human-readable discount message
 */
export function getDiscountMessage(
  discountValue: number,
  discountType: 'percentage' | 'fixed'
): string {
  if (discountType === 'percentage') {
    return `${discountValue}% off`;
  }
  return `Save $${discountValue}`;
}

/**
 * Sort cart items by name
 * @param items - Array of cart items
 * @param ascending - Sort order (default: true)
 * @returns Sorted array
 */
export function sortCartItems(items: any[], ascending: boolean = true): any[] {
  return [...items].sort((a, b) => {
    const comparison = a.title.localeCompare(b.title);
    return ascending ? comparison : -comparison;
  });
}

/**
 * Filter cart items by price range
 * @param items - Array of cart items
 * @param minPrice - Minimum price
 * @param maxPrice - Maximum price
 * @returns Filtered array
 */
export function filterCartItemsByPrice(
  items: any[],
  minPrice: number = 0,
  maxPrice: number = Infinity
): any[] {
  return items.filter(item => item.price >= minPrice && item.price <= maxPrice);
}

/**
 * Generate cart summary text
 * @param itemCount - Total number of items
 * @param subtotal - Cart subtotal
 * @returns Summary text (e.g., "3 items, $99.99")
 */
export function getCartSummaryText(itemCount: number, subtotal: number): string {
  const itemText = itemCount === 1 ? 'item' : 'items';
  return `${itemCount} ${itemText}, ${formatPrice(subtotal)}`;
}

/**
 * Check if cart qualifies for free shipping
 * @param subtotal - Cart subtotal
 * @param freeShippingThreshold - Required amount for free shipping
 * @returns True if qualifies
 */
export function qualifiesForFreeShipping(
  subtotal: number,
  freeShippingThreshold: number = 100
): boolean {
  return subtotal >= freeShippingThreshold;
}

/**
 * Get amount needed for free shipping
 * @param subtotal - Current cart subtotal
 * @param freeShippingThreshold - Required amount
 * @returns Amount needed (0 if already qualifies)
 */
export function getAmountUntilFreeShipping(
  subtotal: number,
  freeShippingThreshold: number = 100
): number {
  const needed = freeShippingThreshold - subtotal;
  return Math.max(0, needed);
}

/**
 * Create cart item from product
 * @param product - Product object
 * @param quantity - Quantity to add (default: 1)
 * @returns Cart item object
 */
export function createCartItem(product: any, quantity: number = 1): any {
  return {
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image,
    quantity: Math.max(1, quantity)
  };
}

/**
 * Merge duplicate items in cart
 * @param items - Array of cart items
 * @returns Array with merged quantities
 */
export function mergeDuplicateItems(items: any[]): any[] {
  const merged = new Map();

  items.forEach(item => {
    if (merged.has(item.id)) {
      const existing = merged.get(item.id);
      existing.quantity += item.quantity;
    } else {
      merged.set(item.id, { ...item });
    }
  });

  return Array.from(merged.values());
}
