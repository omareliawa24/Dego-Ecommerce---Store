import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutService, Order } from '../../core/services/checkout.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];

  constructor(private checkoutService: CheckoutService) {}

  ngOnInit(): void {
    this.orders = this.checkoutService.getOrders();
  }
}
