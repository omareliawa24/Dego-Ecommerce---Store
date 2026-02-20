import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '../../../core/services/cart.service';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [RouterLink, RouterLinkActive, RouterModule, CommonModule]
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Input({ required: true }) isLogined: boolean = false;

  cartItemCount$: Observable<number>;
  cartItemCount: number = 0;
  mobileOpen: boolean = false;

  navLinks: NavLink[] = [
    { label: 'Home',       path: '/home' },
    { label: 'Cart',       path: '/cart' },
    { label: 'Brands',     path: '/brands' },
    { label: 'Categories', path: '/categories' },
    { label: 'Products',   path: '/products' },
  ];

  private destroy$ = new Subject<void>();

  constructor(private cartService: CartService) {
    this.cartItemCount$ = this.cartService.getItemCount$();
  }

  ngOnInit(): void {
    this.cartItemCount$
      .pipe(takeUntil(this.destroy$))
      .subscribe(count => this.cartItemCount = count);
  }

  toggleMobileMenu(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
