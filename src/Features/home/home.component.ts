import { Component, inject, OnInit } from '@angular/core';
import { Products } from '../../core/services/Products/products';
import { Product } from '../../core/model/product';
import { Card } from "../../shared/components/card/card";
import { MainSlider } from "./main-slider/main-slider";

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [Card, MainSlider],
})
export class HomeComponent implements OnInit {
  
  private readonly productsService = inject(Products);
  productsList: Product[] = [];

  ngOnInit() {
    this.getAllProductData();
  }

  getAllProductData(): void {

    this.productsService.getAllProducts().subscribe({

      next: (data) => {
        this.productsList = data;
        console.log(this.productsList);
      },

      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }
}
