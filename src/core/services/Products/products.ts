import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Products {
    
  private readonly httpClient = inject(HttpClient);

  getAllProducts(pageNumber:number=1):Observable<any> {
    return this.httpClient.get('https://fakestoreapi.com/products?limit=8&page='+pageNumber);
  }

}
