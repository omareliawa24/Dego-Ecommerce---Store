import { Component, Input } from '@angular/core';
import { Product } from '../../../core/model/product';
import { RouterLink } from "@angular/router";
import { LowerCasePipe } from '@angular/common';
import { ShortTextPipe } from '../../pipes/short-text-pipe';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink, LowerCasePipe, ShortTextPipe],
  templateUrl: './card.html',
  styleUrl: './card.css'
})
export class Card {

   @Input({ required: true }) product: Product = {} as Product;

  constructor(
    private cartService: CartService,
    private toastService: ToastService
  ) { }

  /**
   * Add product to cart with animation feedback
   */
  addToCart(): void {
    const cartItem = {
      id: this.product.id,
      title: this.product.title,
      price: this.product.price,
      image: this.product.image
    };

    this.cartService.addToCart(cartItem);

    this.toastService.show(
      `${this.product.title} added to cart!`,
      'success',
      3000
    );
  }

}

