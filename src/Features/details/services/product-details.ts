import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductDetails {

    private readonly httpClient = inject(HttpClient);

    getProductDetails(id: string | null):Observable<any> {
      return this.httpClient.get(`https://fakestoreapi.com/products/${id}`);
    }

  
}
