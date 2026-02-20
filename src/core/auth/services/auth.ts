import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private readonly httpClient = inject(HttpClient);


  registerForm(data:any):Observable<any> {
    return this.httpClient.post('https://ecommerce.routemisr.com/api/v1/auth/signup', data);
  }

  loginForm(data:any):Observable<any> { 
    return this.httpClient.post('https://ecommerce.routemisr.com/api/v1/auth/signin', data);
  }

  logOut():void {}

  
}
