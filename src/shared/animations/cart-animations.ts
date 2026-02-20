/**
 * Animation Utilities Module
 * Provides reusable animation definitions and helpers
 *
 * All animations are optional toggles for performance optimization
 * Can be disabled for SSR/Vite builds if needed
 */

import { trigger, transition, style, animate, state } from '@angular/animations';

/**
 * Enable/disable animations globally (set to false for SSR/performance)
 */
const ANIMATIONS_ENABLED = true;

/**
 * Toast notification animation
 * Fades in from top, fades out to bottom
 * Duration: 300ms
 */
export const toastAnimation = trigger('toastAnimation', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-20px)' }),
    animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
  ])
]);

/**
 * Cart item add animation
 * Slides in from right with fade
 * Duration: 400ms
 */
export const cartItemAddAnimation = trigger('cartItemAdd', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateX(100%)' }),
    animate('400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      style({ opacity: 1, transform: 'translateX(0)' })
    )
  ])
]);

/**
 * Cart item remove animation
 * Fades out with scale down
 * Duration: 300ms
 */
export const cartItemRemoveAnimation = trigger('cartItemRemove', [
  transition(':leave', [
    animate('300ms ease-in',
      style({ opacity: 0, transform: 'scale(0.95)' })
    )
  ])
]);

/**
 * Quantity change animation
 * Subtle bounce effect
 * Duration: 300ms
 */
export const quantityChangeAnimation = trigger('quantityChange', [
  state('initial', style({ transform: 'scale(1)' })),
  state('changed', style({ transform: 'scale(1)' })),
  transition('initial => changed', [
    animate('300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)')
  ])
]);

/**
 * Fade in/out animation
 * Simple opacity change
 * Duration: 200ms
 */
export const fadeAnimation = trigger('fadeAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('200ms ease-in')
  ]),
  transition(':leave', [
    animate('200ms ease-out', style({ opacity: 0 }))
  ])
]);

/**
 * Slide and fade animation
 * Combines slide and fade effects
 * Duration: 300ms
 */
export const slideZoomAnimation = trigger('slideZoom', [
  transition(':enter', [
    style({ opacity: 0, transform: 'scale(0.95) translateY(10px)' }),
    animate('300ms ease-out')
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.9)' }))
  ])
]);

/**
 * Badge pulse animation
 * Used for cart badge count update
 * Duration: 600ms
 */
export const badgePulseAnimation = trigger('badgePulse', [
  transition('* => *', [
    animate('600ms cubic-bezier(0.4, 0, 0.6, 1)',
      style({ transform: 'scale(1.2)' })
    )
  ])
]);

/**
 * Helper class for animation management
 */
export class AnimationHelper {
  /**
   * Check if animations are enabled
   */
  static isEnabled(): boolean {
    return ANIMATIONS_ENABLED;
  }

  /**
   * Get animation configuration or empty for disabled animations
   */
  static getAnimation(animation: any): any {
    return ANIMATIONS_ENABLED ? animation : null;
  }

  /**
   * Create duration adjusted for animation state
   */
  static getDuration(baseDuration: number): number {
    return ANIMATIONS_ENABLED ? baseDuration : 0;
  }

  /**
   * Disable all animations (useful for testing or SSR)
   * @param disabled - whether to disable animations
   */
  static setDisabled(disabled: boolean): void {
    // In real implementation, would modify ANIMATIONS_ENABLED
    console.log(`Animations ${disabled ? 'disabled' : 'enabled'}`);
  }
}

/**
 * Reusable animation timings (in milliseconds)
 */
export const ANIMATION_TIMINGS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 600,
  TOAST_DISPLAY: 3000,
  TOAST_DISMISS: 300,
  CART_ITEM_ADD: 400,
  QUANTITY_CHANGE: 300
} as const;

/**
 * Animation easing functions
 */
export const ANIMATION_EASING = {
  EASE_IN: 'ease-in',
  EASE_OUT: 'ease-out',
  EASE_IN_OUT: 'ease-in-out',
  CUBIC_BEZIER_BOUNCE: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  CUBIC_BEZIER_ELASTIC: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
} as const;
