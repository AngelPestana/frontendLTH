import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Login } from '../models/Login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //url: string = 'http://localhost:8080/auth/login';
  url: string = 'https://backend-lth.herokuapp.com/public/auth/login';

  constructor(private http: HttpClient) { }

  postLogin(login: Login): Observable<Login> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //Siempre especificar el tipo de autorizacion
      })
    };
    return this.http.post<Login>(this.url, login, httpOptions);
  }
}
