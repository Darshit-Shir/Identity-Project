import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductModel } from '../Model/ProductModel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7025/api'; // Replace with your API URL

  constructor(private http: HttpClient) { }

  login(loginData:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, loginData);
  }

  signup(inputData:any): Observable<any> {
    return this.http.post(`${this.apiUrl}/Registration`,inputData);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  IsLoggedIn(){
    return localStorage.getItem('token') != null;
   }

   GetToken(){
    return localStorage.getItem('token') != null? localStorage.getItem('token'):'';
   }

   GetProductList(mode:any){
    return this.http.get(`${this.apiUrl}/Product/GetProductList?mode=${mode}`);
   }

   GetProductById(id:any,mode:any){
    return this.http.get(`${this.apiUrl}/Product/GetProduct?id=${id}&mode=${mode}`);
   }

   AddProduct(formData:any){
    return this.http.post(`${this.apiUrl}/Product/AddProduct`,formData);
   }

   UpdateProduct(formData:any){
    return this.http.put(`${this.apiUrl}/Product/UpdateProduct`, formData);
   }

   DeleteProduct(id:any,mode:string){
    return this.http.delete(`${this.apiUrl}/Product/DeleteProduct?id=${id}&mode=${mode}`);
   }

   CategotyList(){
    return this.http.get(`${this.apiUrl}/Product/GetCategoryList`);
   }

}