import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService, ShippingAddress, Order } from '../../core/services/checkout.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      details: ['', [Validators.required, Validators.minLength(5)]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-]{7,15}$/)]],
      city: ['', [Validators.required]],
      paymentMethod: ['cash', [Validators.required]]
    });
  }

  ngOnInit(): void {
    const snapshot = this.checkoutService.getCartSnapshot();
    if (!snapshot) {
      this.cartService.getCartState$().subscribe(s => this.checkoutService.setCartSnapshot(s));
    }
  }

  get f() {
    return this.checkoutForm.controls as { [key: string]: any };
  }

  onPay(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const cart = this.checkoutService.getCartSnapshot() || this.cartService.getCartState();
    if (!cart || cart.itemCount === 0) {
      this.router.navigate(['/cart']);
      return;
    }

    this.isSubmitting = true;

    const addr: ShippingAddress = {
      details: this.f['details'].value,
      phone: this.f['phone'].value,
      city: this.f['city'].value
    };

    const baseOrder: Order = {
      id: '',
      items: cart.items,
      subtotal: cart.subtotal,
      discountAmount: cart.discountAmount,
      tax: cart.tax,
      shippingCost: cart.shippingCost,
      total: cart.total,
      shippingAddress: addr,
      paymentMethod: this.f['paymentMethod'].value,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    };

    if (baseOrder.paymentMethod === 'cash') {
      this.checkoutService.createOrder(baseOrder).subscribe(() => {
        this.isSubmitting = false;
        this.router.navigate(['/orders']);
      });
      return;
    }

    this.checkoutService.setPendingOrder(baseOrder);
    this.router.navigate(['/payment-gateway']).finally(() => (this.isSubmitting = false));
  }
}
