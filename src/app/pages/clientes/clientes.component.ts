import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import { NgxSpinnerService } from 'ngx-spinner';
import { Details } from 'src/app/models/Details';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  formulario: any;
  estaBuscando = false;
  buscar = '';
  urlBaseBusqueda = 'http://localhost:8080/api/clientes/busqueda';
  urlBase = 'http://localhost:8080/api/clientes';
  url = 'http://localhost:8080/api/clientes';
  clientes: Cliente[] = [];
  cliente: Cliente[] = [];
  details: Details | any;//por objeto
  numbers: number[] = [];
  constructor(private ps: ClienteService, private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit(): void {
    this.obtenerClientes();
    this.formularioReactivo();
  }

  formularioReactivo(): void {
    this.formulario = new FormGroup({
      busqueda: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50)
      ])
    });
    //console.log(this.formulario);
  }

  obtenerClientesBase() {
    this.estaBuscando = false;
    this.formulario.reset();
    this.spinner.show();//Mostramos el loading
    this.ps.getClientes().subscribe((res: any) => {
      this.clientes = res.clientes;
      this.details = res.getDetails;
      console.log(this.clientes);
      console.log(this.details);
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
    console.log(this.url)
    this.ps.getClientes2(this.url).subscribe((res: any) => {
      this.clientes = res.clientes;
      this.details = res.getDetails;
      console.log(this.clientes);
      console.log(this.details);
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

  mostrarOtrosClientes(otroUrl: string) {
    //console.log(otroUrl);
    this.url = otroUrl;
    //console.log(this.url);
    this.obtenerClientes();
  }

  mostrarOtrosClientes2(otroUrl: string) {//para el boton de busqueda
    //console.log(otroUrl);
    this.estaBuscando = true;
    this.buscar = this.formularioControl.busqueda.value;
    this.url = otroUrl + '/' + this.formularioControl.busqueda.value;
    this.obtenerClientes();
  }

  cortarCadena(cadena: string): string {
    if (cadena.length > 50) {
      return cadena.substring(0, 50) + '...';
    } else {
      return cadena;
    }
  }

  mensajeError(mensaje: string) {
    Swal.fire({
      icon: 'error',
      title: mensaje,
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    });
  }

  paginaActiva(currentpage: number, numero: number): string {
    if (currentpage == numero){
      return "active"
    }
    return ""
  }

  entroEnGestion(id: number | undefined) {
    
  }

  get formularioControl() {//NO borrar
    return this.formulario.controls;
  }

}
