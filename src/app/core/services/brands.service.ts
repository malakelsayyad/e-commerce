import { environment } from './../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BrandsService {

  constructor( private _HttpClient:HttpClient) { }

  getBrands():Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/brands`)
  }
  getSpecificBrand(idBrand:string|null):Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/brands/${idBrand}`)
  }
}
