import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '../services/auth';
import { Router, RouterLink } from '@angular/router';
import { NgClass, NgIf, NgFor } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgFor, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit, OnDestroy {

  private readonly auth   = inject(Auth);
  private readonly router = inject(Router);

  LoginForm!: FormGroup;
  isLoading:    boolean = false;
  MsgError:     string  = '';
  showPassword: boolean = false;

  /** Features shown on the left decorative panel */
  features: string[] = [
    'Access your orders anytime',
    'Track shipments in real-time',
    'Exclusive member discounts',
    'Secure & private checkout',
  ];

  private subscription = new Subscription();

  initForm(): void {
    this.LoginForm = new FormGroup({
      email:    new FormControl<string | null>(null, [Validators.required, Validators.email]),
      password: new FormControl<string | null>(null, [Validators.required, Validators.minLength(6)]),
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  SubmitForm(): void {
    this.LoginForm.markAllAsTouched();
    this.MsgError = '';

    if (this.LoginForm.invalid) return;

    this.subscription.unsubscribe();
    this.isLoading = true;

    this.subscription = this.auth.loginForm(this.LoginForm.value).subscribe({
      next: (response) => {
        if (response.message === 'success') {
          localStorage.setItem('userToken', response.token);
          this.router.navigate(['/home']);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.MsgError = error.error?.message || 'An unexpected error occurred. Please try again.';
        this.isLoading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
