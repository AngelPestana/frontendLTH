import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bateria } from '../models/Bateria';

@Injectable({
  providedIn: 'root'
})
export class BateriaService {
  url: string = 'http://localhost:8080/api/baterias';
  url2: string = 'http://localhost:8080/api/costoGrupo';

  constructor(private http: HttpClient) {

  }

  getBaterias () {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //Siempre especificar el tipo de autorizacion
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(this.url, httpOptions);
  }

  getGrupos() {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //Siempre especificar el tipo de autorizacion
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(this.url2, httpOptions);
  }

  getBaterias2 (url: string) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //Siempre especificar el tipo de autorizacion
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(url, httpOptions);
  }

  getBateria(id: number | undefined) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //Siempre especificar el tipo de autorizacion
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(this.url + '/edit/' + id, httpOptions);
  }

  postBateria(bateria: Bateria): Observable<Bateria> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //Siempre especificar el tipo de autorizacion
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post<Bateria>(this.url + '/create', bateria, httpOptions);
  }

  putBateria(bateria: Bateria, id: string): Observable<Bateria> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //Siempre especificar el tipo de autorizacion
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.put<Bateria>(this.url + '/update/' + id, bateria, httpOptions);
  }

  deleteBateria(id: string) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //Siempre especificar el tipo de autorizacion
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.delete(this.url + '/delete/' + id, httpOptions);
  }

  getPrecioAlCliente(idCliente: number, idBateria: number) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //Siempre especificar el tipo de autorizacion
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(this.url + '/precioCliente/' + idCliente + '/' + idBateria, httpOptions);
  }
}
