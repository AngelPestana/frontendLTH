import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Codificar } from 'src/app/helpers/Codificar';
import { Bateria } from 'src/app/models/Bateria';
import { Cliente } from 'src/app/models/Cliente';
import { Details } from 'src/app/models/Details';
import { BateriaService } from 'src/app/services/bateria.service';
import { ClienteService } from 'src/app/services/cliente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-consultar-precio',
  templateUrl: './consultar-precio.component.html',
  styleUrls: ['./consultar-precio.component.css']
})
export class ConsultarPrecioComponent implements OnInit {

  formBusqueda1: any;
  formBusqueda2: any;
  idCliente = 0;
  idBateria = 0;
  precioCliente: any;
  GetSubscription: Subscription | any;

  estaBuscando = false;
  buscar = '';
  urlBaseBusqueda = 'http://localhost:8080/api/clientes/search';
  urlBase = 'http://localhost:8080/api/clientes';
  url = 'http://localhost:8080/api/clientes';
  clientes: Cliente[] = [];
  cliente: Cliente | any;
  details1: Details | any;//por objeto
  numbers: number[] = [];
  GetSubscriptions: Subscription | any;
  // atributos para la bateria
  estaBuscando2 = false;
  buscar2 = '';
  urlBaseBusqueda2 = 'http://localhost:8080/api/baterias/search';
  urlBase2 = 'http://localhost:8080/api/baterias';
  url2 = 'http://localhost:8080/api/baterias';
  baterias: Bateria[] = [];
  details2: Details | any;//por objeto
  numbers2: number[] = [];
  GetSubscriptions2: Subscription | any;

  constructor(private service: ClienteService, private service2: BateriaService, private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit(): void {
    this.obtenerClientes();
    this.obtenerBaterias();
    this.formulariosReactivos();
    //console.log(this.precioCliente);
    //console.log(this.formListClientControl.busqueda1.value);
  }

  formulariosReactivos(): void {
    this.formBusqueda1 = new FormGroup({
      busqueda1: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ])
    }),
    this.formBusqueda2 = new FormGroup({
      busqueda2: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ])
    })
    //console.log(this.formulario);
  }

  obtenerClientesBase() {
    this.formBusqueda1.reset();//Borramos el campo de busqueda
    this.estaBuscando = false;//Indicamos que no esta buscando para formatear la paginacion
    this.spinner.show();//Mostramos el loading
    this.GetSubscriptions = this.service.getClientes().subscribe((res: any) => {
      this.clientes = res.clientes;
      this.details1 = res.getDetails;
      //console.log(this.clientes);
      //console.log(this.details);
      //console.log('siguiente: ' + this.details.next);
      //console.log('anterior: ' + this.details.previous);
      this.contar();
      this.cerrarLoading();
    }, ((error: any) => {
      //console.log(error);
      this.cerrarLoading();
      let mensajeErrorConEtiquetas = error.error.messages.error;
      let mensajeError = mensajeErrorConEtiquetas.replace(/<[^>]*>?/g, '');
      this.mensajeError2(mensajeError);
    }));
  }

  obtenerClientes() {
    this.spinner.show();//Mostramos el loading
    //console.log(this.url)
    this.GetSubscriptions = this.service.getClientes2(this.url).subscribe((res: any) => {
      this.clientes = res.clientes;
      this.details1 = res.getDetails;
      //console.log(this.clientes);
      //console.log(this.details);
      //console.log('siguiente: ' + this.details.next);
      //console.log('anterior: ' + this.details.previous);
      this.contar();
      this.cerrarLoading();
    }, ((error: any) => {
      //console.log(error);
      this.cerrarLoading();
      let mensajeErrorConEtiquetas = error.error.messages.error;
      let mensajeError = mensajeErrorConEtiquetas.replace(/<[^>]*>?/g, '');
      this.mensajeError2(mensajeError);
    }));
  }

  obtenerBateriasBase() {
    this.estaBuscando2 = false;
    this.formBusqueda2.reset();
    this.spinner.show();//Mostramos el loading
    this.GetSubscriptions2 = this.service2.getBaterias().subscribe((res: any) => {
      this.baterias = res.baterias;
      this.details2 = res.getDetails;
      //console.log(this.baterias);
      //console.log(this.details);
      //console.log('siguiente: ' + this.details.next);
      //console.log('anterior: ' + this.details.previous);
      this.contar2();
      this.cerrarLoading();
    }, ((error: any) => {
      //console.log(error);
      this.cerrarLoading();
      let mensajeErrorConEtiquetas = error.error.messages.error;
      let mensajeError = mensajeErrorConEtiquetas.replace(/<[^>]*>?/g, '');
      this.mensajeError2(mensajeError);
    }));
  }

  obtenerBaterias() {
    this.spinner.show();//Mostramos el loading
    //console.log(this.url)
    this.GetSubscriptions2 = this.service2.getBaterias2(this.url2).subscribe((res: any) => {
      this.baterias = res.baterias;
      this.details2 = res.getDetails;
      //console.log(this.baterias);
      //console.log(this.details);
      //console.log('siguiente: ' + this.details.next);
      //console.log('anterior: ' + this.details.previous);
      this.contar2();
      this.cerrarLoading();
    }, ((error: any) => {
      //console.log(error);
      this.cerrarLoading();
      let mensajeErrorConEtiquetas = error.error.messages.error;
      let mensajeError = mensajeErrorConEtiquetas.replace(/<[^>]*>?/g, '');
      this.mensajeError2(mensajeError);
    }));
  }

  mostrarOtrosBaterias(otroUrl: string) {
    //console.log(otroUrl);
    this.url2 = otroUrl;
    //console.log(this.url);
    this.obtenerBaterias();
  }

  mostrarOtrosBaterias2(otroUrl: string) {//para el boton de busqueda
    //console.log(otroUrl);
    this.estaBuscando2 = true;
    let diagonalQuitado = Codificar.codificarDiagonal(this.formControlBusqueda2.busqueda2.value);
    //console.log(diagonalQuitado);
    this.buscar2 = diagonalQuitado;
    this.url2 = otroUrl + '/' + diagonalQuitado;
    this.obtenerBaterias();
  }

  paginaActiva2(currentpage: number, numero: number): string {
    if (currentpage == numero){
      return "active"
    }
    return ""
  }

  cerrarLoading(): void {
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 500);
  }

  contar() {// paginacion para los clientes
    this.numbers = [];
    for (let i = 1; i <= this.details1.pageCount; i++) {
      this.numbers.push(i);
    }
  }

  contar2() {// paginacion para las baterias
    this.numbers2 = [];
    for (let i = 1; i <= this.details2.pageCount; i++) {
      this.numbers2.push(i);
    }
  }

  mensajeError2(mensaje: string) {//En caso que para consultar los datos de la tabla salga con error entonces que muestre este alert
    Swal.fire({
      icon: 'error',
      title: mensaje,
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.router.navigate(['/home']);//Para que me rediriga a la pagina de inicio
      }
    })
  }

  mostrarOtrosClientes(otroUrl: string) {//para la paginacion
    this.url = otroUrl;
    this.obtenerClientes();
  }

  mostrarOtrosClientes2(otroUrl: string) {//para el boton de busqueda
    this.estaBuscando = true;
    this.buscar = this.formControlBusqueda1.busqueda1.value;//esta variable nos sirve para que la paginacion en caso de busqueda
    //mandemos el valor que queremos buscar y asi mismo realizar la paginacion
    this.url = otroUrl + '/' + this.formControlBusqueda1.busqueda1.value;
    this.obtenerClientes();
  }

  mensajeError(mensaje: string) {//este mensaje es para el crud en caso de error
    Swal.fire({
      icon: 'error',
      title: mensaje,
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    });
  }

  paginaActiva(currentpage: number, numero: number): string {// colorcito de pagina activa en lista de clientes
    if (currentpage == numero){
      return "active"
    }
    return ""
  }

  mensajeExito(mensaje: string) {//este mensaje es para el crud en caso de exito
    Swal.fire({
      icon: 'success',
      title: mensaje,
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        window.location.reload();//Para que actualice la tabla
      }
    })
  }

  establecerIdCliente(idCliente: number | any): void{
    this.idCliente = idCliente;
  }

  establecerIdBateria(idBateria: number | any): void {
    this.idBateria = idBateria;
  }

  checarIds(): boolean {
    if (this.idCliente == 0 || this.idBateria == 0){
      return true;
    }
    return false;
  }

  consultarPrecioBateria(): void {
    //console.log('Quieres consutar el precio verdad prro!!!');
    this.precioCliente = undefined;//para vaciar la variable en caso de mostrar otra consulta
    this.spinner.show();
    this.GetSubscription = this.service2.getPrecioAlCliente(this.idCliente, this.idBateria).subscribe((res: any) => {
      this.precioCliente = res;
      this.cerrarLoading();
    },(error: any) => {
      this.cerrarLoading();
      let mensajeErrorConEtiquetas = error.error.messages.error;
      let mensajeError = mensajeErrorConEtiquetas.replace(/<[^>]*>?/g, '');
      this.mensajeError2(mensajeError);
    });
  }

  get formControlBusqueda1() {//NO borrar
    return this.formBusqueda1.controls;
  }

  get formControlBusqueda2() {//NO borrar
    return this.formBusqueda2.controls;
  }

  ngOnDestroy(): void {
    this.GetSubscriptions.unsubscribe();
    this.GetSubscriptions2.unsubscribe();
    //console.log('Hola se ejecuto el ngOnDestroy')
  }

}
