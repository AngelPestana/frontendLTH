import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Details } from 'src/app/models/Details';
import { Pedido } from 'src/app/models/Pedido';
import { PedidoService } from 'src/app/services/pedido.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.css']
})
export class PedidosComponent implements OnInit {

  formulario: any;
  estaBuscando = false;
  buscar = '';
  buscar2 = '';
  url = 'https://backend-lth.herokuapp.com/public/api/pedidos';
  urlBaseBusqueda = 'https://backend-lth.herokuapp.com/public/api/pedidos/search';
  urlBase = 'https://backend-lth.herokuapp.com/public/api/pedidos';
  //urlBaseBusqueda = 'http://localhost:8080/api/pedidos/search';
  //urlBase = 'http://localhost:8080/api/pedidos';
  //url = 'http://localhost:8080/api/pedidos';
  pedidos: Pedido[] = [];
  details: Details | any;//por objeto
  numbers: number[] = [];
  GetSubscriptions: Subscription | any;
  DeleteSubscription: Subscription | any;

  constructor(private service: PedidoService, private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit(): void {
    this.obtenerPedidos();
    this.formularioReactivo();
  }

  formularioReactivo(): void {
    this.formulario = new FormGroup({
      busqueda: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      busqueda2: new FormControl('', [
        Validators.required
      ])
    });
    //console.log(this.formulario);
  }

  obtenerPedidosBase() {
    this.estaBuscando = false;
    this.formulario.reset();
    this.spinner.show();//Mostramos el loading
    this.GetSubscriptions = this.service.getPedidos().subscribe((res: any) => {
      this.pedidos = res.pedidos;
      this.details = res.getDetails;
      //console.log(this.pedidos);
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

  obtenerPedidos() {
    this.spinner.show();//Mostramos el loading
    //console.log(this.url)
    this.GetSubscriptions = this.service.getPedidos2(this.url).subscribe((res: any) => {
      this.pedidos = res.pedidos;
      this.details = res.getDetails;
      //console.log(this.pedidos);
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

  cerrarLoading(): void {
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 500);
  }

  contar() {
    this.numbers = [];
    for (let i = 1; i <= this.details.pageCount; i++) {
      this.numbers.push(i);
    }
  }

  mensajeError2(mensaje: string) {
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

  mostrarOtrosPedidos(otroUrl: string) {
    //console.log(otroUrl);
    this.url = otroUrl;
    //console.log(this.url);
    this.obtenerPedidos();
  }

  mostrarOtrosPedidos2(otroUrl: string) {//para el boton de busqueda
    //console.log(otroUrl);
    this.estaBuscando = true;
    this.buscar = this.formularioControl.busqueda.value;
    this.buscar2 = this.formularioControl.busqueda2.value;
    if (this.buscar == null || this.buscar == ''){
      this.buscar = ',';
    }
    if (this.buscar2 == null || this.buscar2 == ''){
      this.buscar2 = ',';
    }
    //console.log(this.buscar);
    //console.log(this.formularioControl.busqueda2.value);
    //console.log(typeof(this.buscar));
    //console.log(typeof(this.formularioControl.busqueda2.value));
    
    this.url = otroUrl + '/' + this.buscar + '/' + this.buscar2;
    //console.log(this.url);
    this.obtenerPedidos();
  }

  paginaActiva(currentpage: number, numero: number): string {
    if (currentpage == numero){
      return "active"
    }
    return ""
  }

  validacion():boolean {
    if ((this.formulario.controls.busqueda.status === 'INVALID' && this.formulario.controls.busqueda2.status === 'VALID') || (this.formulario.controls.busqueda.status === 'VALID' && this.formulario.controls.busqueda2.status === 'INVALID') || (this.formulario.controls.busqueda.status === 'VALID' && this.formulario.controls.busqueda2.status === 'VALID')) {
      return false;
    }
    return true;
  }

  preguntarEliminacion(idPedido: string): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-danger me-3',
        cancelButton: 'btn btn-success'
      },
      buttonsStyling: false
    })
    
    swalWithBootstrapButtons.fire({
      title: '¿Esta seguro?',
      text: "Esta a punto de eliminar un pedido, esto no se podrá revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar pedido!!',
      cancelButtonText: 'No, cancelar!!',
      reverseButtons: false
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarPedido(idPedido);
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {}
    })
  }

  eliminarPedido(idPedido: string): void {
    //Falta programar el de eliminar
    this.spinner.show();
    this.DeleteSubscription = this.service.deletePedido(idPedido).subscribe((res: any) => {
      this.cerrarLoading();
      let mensaje = 'Se eliminó el pedido con exito!!';
      this.mensajeExito(mensaje);
    }, (error: any) => {
      this.cerrarLoading();
      //console.log(error);
      let mensajeErrorConEtiquetas = error.error.messages.error;
      let mensajeError = mensajeErrorConEtiquetas.replace(/<[^>]*>?/g, '');
      this.mensajeError(mensajeError);
    })
  }

  mensajeExito(mensaje: string) {
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

  mensajeError(mensaje: string) {
    Swal.fire({
      icon: 'error',
      title: mensaje,
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    });
  }

  get formularioControl() {//NO borrar
    return this.formulario.controls;
  }

  ngOnDestroy(): void {
    this.GetSubscriptions.unsubscribe();
    //console.log('Hola se ejecuto el ngOnDestroy')
  }

}
