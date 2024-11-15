import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductsResponse } from "../../../shared/models/products";
import { User } from "../../../shared/models/user";
import {endpoints} from '../../../enviroments/endpoints';

/**
 * @description
 * Servicio para gestionar las solicitudes de datos relacionadas con productos y usuarios.
 *
 * @usageNotes
 * Este servicio se utiliza para obtener datos de productos y usuarios desde archivos JSON.
 *
 * @example
 * ```typescript
 * constructor(private dataService: DataService) {}
 *
 * this.dataService.getProducts().subscribe(products => {
 *   this.products = products;
 * });
 *
 * this.dataService.getUsers().subscribe(users => {
 *   this.users = users;
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class DataService {



  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer 2d4b8422-c7f4-4b1d-8b73-439bba7af688'
    })
  }

  /**
   * Constructor del servicio DataService.
   *
   * @param http Cliente HTTP para realizar solicitudes.
   */
  constructor(private http: HttpClient) { }

  /**
   * Obtiene los datos de productos desde el archivo JSON.
   *
   * @returns Observable que emite los datos de productos.
   */
  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(endpoints.products.path);
  }

  /**
   * Obtiene los datos de usuarios desde el archivo JSON.
   *
   * @returns Observable que emite los datos de usuarios.
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(endpoints.users.path);
  }

  addUser(user:User[]) {
    console.log(user);
    return  this.http.post(endpoints.users.path,user,this.httpOptions);
  }
}
