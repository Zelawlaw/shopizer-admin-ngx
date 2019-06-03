import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) {
  }

  getOrders(): Observable<any> {
    const params = new HttpParams();
    params.set('count', '25');
    params.set('start', '0');
    return this.http.get(`${environment.apiUrl}/v1/admin/orders`,
      {responseType: 'json', params});
  }

  getOrder(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/v1/auth/orders/${id}`,
      {responseType: 'json'} );
  }

}
