import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { HomeComponent } from '../Features/home/home.component';
import { ProductsComponent } from '../Features/products/products.component';
import { DetailsComponent } from '../Features/details/details.component';
import { CategoriesComponent } from '../Features/categories/categories.component';
import { BrandsComponent } from '../Features/brands/brands.component';
import { CheckoutComponent } from '../Features/checkout/checkout.component';
import { CartComponent } from '../Features/cart/cart.component';
import { NotfoundComponent } from '../Features/notfound/notfound.component';
import { OrdersComponent } from '../Features/orders/orders.component';
import { AuthLayout } from '../core/layouts/auth-layout/auth-layout';
import { BlankLayout } from '../core/layouts/blank-layout/blank-layout';
import { Login } from '../core/auth/login/login';
import { register } from 'module';
import { Register } from '../core/auth/register/register';

export const routes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{
		path: '',    /* Auth Layout contains on ( login - register navbar ) */
		component: AuthLayout,
		children: [
			{ path: 'login', component: Login, title: 'Login Page' },
			{ path: 'register', component: Register, title: 'Register Page' },
		],
	},

	{
		path: '',  /* blank Layout */
		component: BlankLayout,
		children: [
			{ path: 'home', component: HomeComponent, title: 'Home Page' },
			{ path: 'brands', component: BrandsComponent, title: 'Brands Page' },
			{ path: 'categories', component: CategoriesComponent, title: 'Categories Page' },
			{ path: 'checkout', component: CheckoutComponent, title: 'Checkout Page' },
			{ path: 'cart', component: CartComponent, title: 'Shopping Cart' },
			{ path: 'orders', component: OrdersComponent, title: 'My Orders' },
			{ path: 'details/:id', component: DetailsComponent, title: 'Details Page' },
			{ path: 'products', component: ProductsComponent, title: 'Products Page' },
			{ path: 'notfound', component: NotfoundComponent, title: 'Notfound Page' },
		],
	},
	{ path: '**', redirectTo: 'notfound', title: 'NotFound Page' }

];
