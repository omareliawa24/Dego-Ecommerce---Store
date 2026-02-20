import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Auth } from '../services/auth';
import { Router, RouterLink } from '@angular/router';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgIf, NgFor],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class Register implements OnInit {

  private readonly auth   = inject(Auth);
  private readonly router = inject(Router);

  registerForm!: FormGroup;

  isLoading:     boolean = false;
  MsgError:      string  = '';
  showPassword:  boolean = false;
  showRePassword: boolean = false;

  /** Steps shown on the left panel */
  steps = [
    { title: 'Create your account',   desc: 'Fill in your basic info to get started' },
    { title: 'Browse products',        desc: 'Explore thousands of premium items' },
    { title: 'Checkout securely',      desc: 'Fast, safe, and encrypted payments' },
  ];

  // ── Password strength ──────────────────────────
  get strengthWidth(): string {
    const val: string = this.registerForm.get('password')?.value ?? '';
    const score = this.calcStrength(val);
    return ['0%', '25%', '55%', '80%', '100%'][score];
  }

  get strengthLabel(): string {
    const val: string = this.registerForm.get('password')?.value ?? '';
    return ['', 'Weak', 'Fair', 'Good', 'Strong'][this.calcStrength(val)];
  }

  get strengthClass(): string {
    const val: string = this.registerForm.get('password')?.value ?? '';
    return ['', 'weak', 'fair', 'good', 'strong'][this.calcStrength(val)];
  }

  private calcStrength(val: string): number {
    if (!val) return 0;
    let score = 0;
    if (val.length >= 6)  score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
    if (/\d/.test(val) && /[^A-Za-z0-9]/.test(val)) score++;
    return Math.min(score, 4);
  }

  // ── Form init ──────────────────────────────────
  initForm(): void {
    this.registerForm = new FormGroup(
      {
        name:       new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
        email:      new FormControl(null, [Validators.required, Validators.email]),
        password:   new FormControl(null, [Validators.required, Validators.pattern(/^\w{6,}$/)]),
        rePassword: new FormControl(null, [Validators.required, Validators.pattern(/^\w{6,}$/)]),
        phone:      new FormControl(null, [Validators.required, Validators.pattern(/^01[0125]\d{8}$/)]),
      },
      { validators: this.confirmPassword }
    );
  }

  ngOnInit(): void {
    this.initForm();
  }

  confirmPassword(group: AbstractControl) {
    return group.get('password')?.value === group.get('rePassword')?.value
      ? null
      : { mismatch: true };
  }

  SubmitForm(): void {
    this.registerForm.markAllAsTouched();
    this.MsgError = '';

    if (this.registerForm.invalid) return;

    this.isLoading = true;

    this.auth.registerForm(this.registerForm.value).subscribe({
      next: (response) => {
        if (response.message === 'success') {
          this.router.navigate(['/login']);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.MsgError = error.error?.message ?? 'An unexpected error occurred.';
        this.isLoading = false;
      },
    });
  }
}
