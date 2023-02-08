import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Pedido } from '../models/Pedido';
import { PedidoPorBateria } from '../models/PedidoPorBateria';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  private contador: number = 0;
  private ppb: PedidoPorBateria [] = [];
  private enviarContadorSubject = new Subject<number>();
  public enviarContadorObservable = this.enviarContadorSubject.asObservable();
  //url: string = 'http://localhost:8080/api/pedidos';
  //url2: string = 'http://localhost:8080/api/pedidosPorBaterias';

  url: string = 'https://backend-lth.herokuapp.com/public/api/pedidos';
  url2: string = 'https://backend-lth.herokuapp.com/public/api/pedidosPorBaterias';

  constructor(private http: HttpClient) { }

  enviarContador(contador: number) {
    this.enviarContadorSubject.next(contador);
    //this.contador = contador;
  }

  agregarBateriaAlPedido(ppb: PedidoPorBateria) {
    this.ppb.push(ppb);
    this.contador++;
    this.enviarContador(this.contador);
  }

  eliminarBateriaAlPedido(ppb: PedidoPorBateria) {
    this.ppb.splice(this.ppb.indexOf(ppb), 1);
    this.contador--;
    this.enviarContador(this.contador);
  }

  obtenerBateriasAlPedido() {
    return this.ppb;
  }

  obtenerContador() {
    return this.contador;
  }

  vaciarPedido() {
    this.ppb = [];
    this.contador = 0;
    this.enviarContador(this.contador);
  }

  obtenerBateriaAlPedido(id: number) {
    return this.ppb[id];
  }

  obtenerTotalDelPedido(): number {
    let total = 0;
    this.ppb.forEach(element => {
      total = total + element.subtotal;
    });
    let totalReducido = total.toFixed(2);
    return +totalReducido;
  }

  obtenerTotalSinDescuento(): number {
    let totalSinDescuento = 0;
    this.ppb.forEach(element => {
      totalSinDescuento = totalSinDescuento + element.subtotalPrecioLista;
    });
    let reducido = totalSinDescuento.toFixed(2);
    return +reducido;
  }

  obtenerTotalDescuento(): number {
    let totalDescuento = 0;
    this.ppb.forEach(element => {
      totalDescuento = totalDescuento + element.subtotalDescuento;
    });
    let reducido = totalDescuento.toFixed(2);
    return +reducido;
  }

  obtenerTotalConDescuento(): number {
    let totalConDescuento = 0;
    this.ppb.forEach(element => {
      totalConDescuento = totalConDescuento + element.subtotalConDescuento;
    });
    let reducido = totalConDescuento.toFixed(2);
    return +reducido;
  }

  //metodos para conexion con la API

  getPedidos () {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //Siempre especificar el tipo de autorizacion
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(this.url, httpOptions);
  }

  getPedidos2 (url: string) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //Siempre especificar el tipo de autorizacion
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(url, httpOptions);
  }

  getPedido(id: number | undefined) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //Siempre especificar el tipo de autorizacion
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(this.url + '/edit/' + id, httpOptions);
  }

  postPedido(pedido: Pedido): Observable<Pedido> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //Siempre especificar el tipo de autorizacion
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post<Pedido>(this.url + '/create', pedido, httpOptions);
  }

  postPedidoPorBateria(pedidoPorBateria: PedidoPorBateria): Observable<PedidoPorBateria> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //Siempre especificar el tipo de autorizacion
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post<PedidoPorBateria>(this.url2 + '/create', pedidoPorBateria, httpOptions);
  }

  putPedido(pedido: Pedido, id: string): Observable<Pedido> {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //Siempre especificar el tipo de autorizacion
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.put<Pedido>(this.url + '/update/' + id, pedido, httpOptions);
  }

  deletePedido(id: string) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        //Siempre especificar el tipo de autorizacion
        Authorization: 'Bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.delete(this.url + '/delete/' + id, httpOptions);
  }

}
