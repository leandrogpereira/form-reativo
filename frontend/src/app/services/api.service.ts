import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = "http://localhost:3001"

  constructor(
    private http: HttpClient
  ) { }

  public showMessage(msg: string) {
    alert(msg);
  }

  public get(route: string): Observable<any> {
    return this.http.get(this.baseUrl + route);
  }

  public find(route: string, id: Number): Observable<any> {
    return this.http.get(this.baseUrl + route + '/' + id.toString());
  }

  public post(route: string, cadastro: any): Observable<any> {
    return this.http.post(this.baseUrl + route, cadastro);
  }

  public delete(route: string, id: Number): Observable<any> {
    return this.http.delete(this.baseUrl + route + '/' + id.toString());
  }
}
