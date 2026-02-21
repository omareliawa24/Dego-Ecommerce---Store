import { Component, inject } from '@angular/core';
import { Card } from "../../shared/components/card/card";
import { Product } from '../../core/model/product';
import { Products } from '../../core/services/Products/products';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { SearchPipe } from '../../shared/pipes/search-pipe';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports: [Card, NgxPaginationModule,FormsModule,SearchPipe]
})
export class ProductsComponent {
  product: any;
  private readonly productsService = inject(Products);

  productsList: Product[] = [];

  pageSize!: number
  p!: number
  total!: number
  text: string = ""

  ngOnInit() {
    this.getAllProductData();
  }
  trackByProductId(index: number, product: Product): number {
  return product.id;
}


  getAllProductData(pageNumber: number = 1): void {

    this.productsService.getAllProducts(pageNumber).subscribe({

      next: (data) => {
        this.productsList = data;
        this.pageSize = data.limit;
        this.p = data.currentPage;
        this.total = data.total;
      },

      error: (error) => {
        console.error('Error fetching products:', error);
      },
    });
  }


}
