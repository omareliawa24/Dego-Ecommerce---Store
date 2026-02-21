import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { FormInput } from '../../shared/components/form-input/form-input';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormInput],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {

  private readonly fb = inject(FormBuilder);
  checkoutForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.checkoutForm = this.fb.group({
      shippingAddress: this.fb.group({
        details: [null, [Validators.required]],
        phone: [null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
        city: [null, [Validators.required]],
      }),
    });
  }

   // ✅ Getters
  get detailsControl(): FormControl {
    return this.checkoutForm.get('shippingAddress.details') as FormControl;
  }

  get phoneControl(): FormControl {
    return this.checkoutForm.get('shippingAddress.phone') as FormControl;
  }

  get cityControl(): FormControl {
    return this.checkoutForm.get('shippingAddress.city') as FormControl;
  }

}
