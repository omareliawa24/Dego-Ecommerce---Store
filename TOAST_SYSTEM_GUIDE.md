# Toast Notification System - Implementation Guide

## 📋 Overview

A complete, reusable toast notification system for your Angular e-commerce application. Displays success, error, info, and warning notifications that auto-dismiss or can be manually closed.

**Key Features:**
- ✅ Success, Error, Info, Warning types
- ✅ Auto-dismiss after 2-3 seconds
- ✅ Manual close button
- ✅ Smooth animations
- ✅ Responsive design
- ✅ SSR-safe (no window/document access)
- ✅ Arabic text support
- ✅ Standalone components
- ✅ Progress bar animation
- ✅ Reusable across entire app

---

## 🏗️ Architecture

### File Structure
```
src/
├── core/
│   └── services/
│       ├── toast.service.ts      ⭐ Manages toast state
│       └── cart.service.ts       (Updated to trigger toasts)
├── shared/
│   └── components/
│       └── toast/
│           ├── toast.component.ts      ⭐ Toast UI component
│           ├── toast.component.html    ⭐ Toast template
│           └── toast.component.css     ⭐ Toast animations
└── app/
    ├── app.ts                    (Updated with ToastComponent)
    └── app.html                  (Updated with app-toast)
```

---

## 🔧 Component Breakdown

### 1. **ToastService** (`src/core/services/toast.service.ts`)

Central service managing all toast notifications using RxJS BehaviorSubject.

#### Toast Interface
```typescript
export interface Toast {
  id: string;              // Unique identifier
  message: string;         // Notification text
  type: ToastType;         // 'success' | 'error' | 'info' | 'warning'
  duration?: number;       // Auto-dismiss time in milliseconds (default: 3000)
}
```

#### Key Methods

| Method | Description |
|--------|-------------|
| `show(message, type, duration)` | Show toast of any type |
| `success(message, duration)` | Quick method for success toast |
| `error(message, duration)` | Quick method for error toast |
| `info(message, duration)` | Quick method for info toast |
| `warning(message, duration)` | Quick method for warning toast |
| `remove(id)` | Remove specific toast by ID |
| `removeAll()` | Clear all toasts |
| `getToasts()` | Get current toast array |

#### Usage Example
```typescript
constructor(private toastService: ToastService) {}

showSuccess() {
  this.toastService.success('تم إضافة المنتج إلى السلة');
}

showError() {
  this.toastService.error('حدث خطأ أثناء إضافة المنتج', 4000);
}
```

---

### 2. **ToastComponent** (`src/shared/components/toast/`)

Standalone component that renders all active toasts.

#### Key Features

✅ **Auto-subscribe to ToastService**
- Automatically displays new toasts as they're added to the service
- Real-time updates using RxJS observable

✅ **Multiple Toast Types**
- Each type has distinct colors and icons:
  - **Success** (green) - Checkmark icon
  - **Error** (red) - X or alert icon
  - **Info** (blue) - Info icon
  - **Warning** (yellow) - Warning icon

✅ **Smooth Animations**
- Slide-in animation when toast appears (300ms)
- Slide-out animation when toast dismissed (300ms)
- Progress bar shrinks over the duration

✅ **Close Button**
- Manual close button (X icon)
- Click to immediately dismiss toast

✅ **Progress Bar**
- Visual indicator of remaining time
- Animated shrink effect based on toast duration
- Color matches toast type

#### Component Methods

```typescript
getIcon(type: string): string         // SVG path for icon
getBgClass(type: string): string      // Background color class
getTextClass(type: string): string    // Text color class
getIconClass(type: string): string    // Icon color class
closeToast(id: string): void          // Remove toast manually
```

---

### 3. **Updated CartService**

The CartService now automatically triggers a success toast when items are added.

```typescript
addToCart(product: Omit<CartItem, 'quantity'>, quantity: number = 1): void {
  // ... existing code ...
  
  // 🎉 Show success toast notification
  this.toastService.success('تم إضافة المنتج إلى السلة', 3000);
}
```

---

## 🎨 UI Design

### Toast Appearance

```
┌────────────────────────────────────────┐  ← Top-right position
│ ✓ تم إضافة المنتج إلى السلة          ✕ │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  ← Progress bar
└────────────────────────────────────────┘
```

### Type-based Styling

| Type | Background | Icon Color | Text Color |
|------|-----------|-----------|-----------|
| **Success** | Light Green (bg-green-50) | Green (text-green-500) | Dark Green (text-green-800) |
| **Error** | Light Red (bg-red-50) | Red (text-red-500) | Dark Red (text-red-800) |
| **Info** | Light Blue (bg-blue-50) | Blue (text-blue-500) | Dark Blue (text-blue-800) |
| **Warning** | Light Yellow (bg-yellow-50) | Yellow (text-yellow-500) | Dark Yellow (text-yellow-800) |

---

## 🔌 Integration Guide

### Step 1: Add ToastComponent to App Root

**app.ts** (already done):
```typescript
import { ToastComponent } from "../shared/components/toast/toast.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, ToastComponent],
  // ...
})
export class App { }
```

**app.html** (already done):
```html
<app-toast></app-toast>  <!-- Add at top -->

<router-outlet></router-outlet>
<app-footer></app-footer>
```

### Step 2: Use in Any Component

#### Option A: Inject ToastService in Component
```typescript
import { ToastService } from '@core/services/toast.service';

@Component({
  selector: 'app-my-component',
  standalone: true
})
export class MyComponent {
  constructor(private toastService: ToastService) {}

  handleSuccess() {
    this.toastService.success('عملية ناجحة!');
  }

  handleError() {
    this.toastService.error('حدث خطأ');
  }
}
```

#### Option B: Triggered from CartService (already done)
```typescript
// When items are added to cart, toast automatically shows
```

---

## 💡 Code Examples

### Show Success Toast
```typescript
this.toastService.success('تم إضافة المنتج إلى السلة');
```

### Show Error with Custom Duration
```typescript
this.toastService.error('فشل تحميل المنتجات', 4000);
```

### Show Info Toast
```typescript
this.toastService.info('جاري تحديث السلة...');
```

### Show Warning Toast
```typescript
this.toastService.warning('هذا المنتج قد لا يكون متوفراً قريباً');
```

### Manual Toast Management
```typescript
// Show toast with manual control
const id = this.toastService.success('رسالة');

// Remove specific toast
setTimeout(() => {
  this.toastService.remove(id);
}, 5000);

// Clear all toasts
this.toastService.removeAll();
```

---

## 🎯 Current Integration

The toast system is **already integrated** with:

✅ **CartService.addToCart()**
When a product is added, the success toast automatically shows:
```
Message: "تم إضافة المنتج إلى السلة" (Arabic)
Duration: 3000ms (3 seconds)
Type: Success (green)
```

The toast displays whenever:
- User clicks "Add to Cart" on product card
- User programmatically adds items via CartService

---

## 🛡️ SSR Safety

The toast system is completely SSR-safe:

✅ **No direct window/document access**
- Uses Angular's event system
- No setTimeout outside service (Angular handles it)
- Safe to run on server

✅ **ViewContainer independent**
- Toasts rendered through component
- Works with Angular Universal
- Vite build compatible

---

## 📱 Responsive Design

### Mobile (Max-width: 640px)
- Toast spans full width (with padding)
- Positioned at top-right
- Adjusts automatically

### Desktop
- Toast in fixed top-right corner
- Max width: 28rem (448px)
- Clear spacing from edges

---

## ⏱️ Animation Details

### Slide-In Animation
- Duration: 300ms
- Easing: ease-out (smooth deceleration)
- Starts from -20px above final position
- Opacity goes from 0 to 1

### Progress Bar Animation
- Duration: matches toast duration (e.g., 3000ms for 3s toast)
- Linear shrink from 100% to 0% width
- Name: `shrink` animation

### Slide-Out Animation
- When dismissed
- Duration: 300ms
- Easing: ease-in
- Smooth fade and slight movement up

---

## 📊 Toast Lifecycle

```
1. User clicks "Add to Cart"
         ↓
2. CartService.addToCart() called
         ↓
3. toastService.success() invoked
         ↓
4. Toast added to BehaviorSubject
         ↓
5. ToastComponent subscribes, renders toast
         ↓
6. CSS animation triggers (slide-in 300ms)
         ↓
7. Progress bar starts shrinking (e.g., 3000ms)
         ↓
8. After duration, toast auto-removed
         ↓
9. CSS animation triggers (slide-out 300ms)
         ↓
10. Toast removed from DOM
```

---

## 🚀 Advanced Usage

### Prevent Auto-dismiss
```typescript
// Duration 0 means no auto-dismiss
this.toastService.show('معلومة مهمة', 'info', 0);

// User must click close button to dismiss
```

### Chain Multiple Toasts
```typescript
this.toastService.success('تم!');
this.toastService.info('جاري معالجة الطلب...');
this.toastService.warning('قد يستغرق وقتاً');
```

All toasts display at once in a vertical stack.

### Create Custom Toast Types

If you need more types, extend the `ToastType`:
```typescript
export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'custom';

// Add styling for custom type in component
getIconClass(type: string): string {
  // ...
  custom: 'text-purple-500'
}
```

---

## 🎯 Current Status

✅ **Fully Implemented and Working**

- ✅ ToastService created
- ✅ ToastComponent created with animations
- ✅ Added to app root
- ✅ CartService integrated
- ✅ Success toast shows on "Add to Cart"
- ✅ Arabic text supported
- ✅ SSR-safe
- ✅ Zero compilation errors
- ✅ Production-ready

---

## 📝 Quick Reference

| Task | Code |
|------|------|
| Show success | `this.toastService.success('رسالة')` |
| Show error | `this.toastService.error('خطأ')` |
| Show info | `this.toastService.info('معلومة')` |
| Show warning | `this.toastService.warning('تحذير')` |
| Remove specific | `this.toastService.remove(id)` |
| Clear all | `this.toastService.removeAll()` |

---

## 🎉 You're All Set!

The toast system is fully integrated and ready to use. Every time a product is added to the cart, a beautiful green success toast with Arabic text will appear in the top-right corner! 

Try clicking "Add to Cart" on any product to see it in action. 🎨
