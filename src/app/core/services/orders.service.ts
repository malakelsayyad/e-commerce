import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private _HttpClient:HttpClient) { }

 

  checkOut(idCart:string|null,shipDetails:object):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/orders/checkout-session/${idCart}?url=${window.location.origin}`,
      {
        "shippingAddress": shipDetails
     },
    
    )
  }


  getOrders(idCart:any):Observable<any>{
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/orders/user/${idCart}`)
  }
}
