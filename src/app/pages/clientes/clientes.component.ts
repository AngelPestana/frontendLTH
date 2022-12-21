import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import { NgxSpinnerService } from 'ngx-spinner';
import { Details } from 'src/app/models/Details';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {

  formulario: any;
  formulario2: any;
  estaEnGestion: boolean = false;
  estaBuscando = false;
  buscar = '';
  urlBaseBusqueda = 'http://localhost:8080/api/clientes/search';
  urlBase = 'http://localhost:8080/api/clientes';
  url = 'http://localhost:8080/api/clientes';
  clientes: Cliente[] = [];
  cliente: Cliente | any;
  details: Details | any;//por objeto
  numbers: number[] = [];
  GetSubscriptions: Subscription | any;
  GetSubscription: Subscription | any;
  PostSubscription: Subscription | any;
  PutSubscription: Subscription | any;
  DeleteSubscription: Subscription | any;

  constructor(private service: ClienteService, private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit(): void {
    this.obtenerClientes();
    this.formularioReactivo();
  }

  formularioReactivo(): void {
    this.formulario = new FormGroup({
      busqueda: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ])
    });
    this.formulario2 = new FormGroup({
      nombreLocal: new FormControl('', [
        Validators.required,
        Validators.pattern("[a-zA-ZÑñ0-9 ]{3,45}"),
        Validators.minLength(3),
        Validators.maxLength(45)
      ]),
      nombrePropietario: new FormControl('', [
        Validators.required,
        Validators.pattern("[a-zA-ZÑñ ]{3,45}"),
        Validators.minLength(3),
        Validators.maxLength(45)
      ]),
      nombreEncargado: new FormControl('', [
        Validators.required,
        Validators.pattern("[a-zA-ZÑñ ]{3,45}"),
        Validators.minLength(3),
        Validators.maxLength(45)
      ]),
      telefono: new FormControl('', [
        Validators.required,
        Validators.pattern("[0-9]{10,10}"),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]),
      municipio: new FormControl('', [
        Validators.required,
        Validators.pattern("[a-zA-Z ]{3,45}"),
        Validators.minLength(3),
        Validators.maxLength(45)
      ]),
      estado: new FormControl('', [
        Validators.required
      ]),
      porcentajeDescuento: new FormControl('', [
        Validators.required,
        Validators.pattern("[0-9.]{1,5}"),
        Validators.minLength(1),
        Validators.maxLength(5)
      ]),
      porcentajeDescuento2: new FormControl('', [
        Validators.required,
        Validators.pattern("[0-9.]{1,5}"),
        Validators.minLength(1),
        Validators.maxLength(5)
      ]),
      direccion: new FormControl('', [
        Validators.required,
        Validators.pattern("[a-zA-Z0-9. ]{10,150}"),
        Validators.minLength(10),
        Validators.maxLength(150)
      ]),
    });
    //console.log(this.formulario);
  }

  obtenerClientesBase() {
    this.estaBuscando = false;
    this.formulario.reset();
    this.spinner.show();//Mostramos el loading
    this.GetSubscriptions = this.service.getClientes().subscribe((res: any) => {
      this.clientes = res.clientes;
      this.details = res.getDetails;
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
      this.details = res.getDetails;
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

  mensajeError(mensaje: string) {//este alert es para el crud en caso de error
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

  entroEnAgregar() {
    this.estaEnGestion = false;
    this.formulario2.reset();//vaciamos el formulario
  }

  entroEnGestion(id: number | undefined) {
    this.estaEnGestion = true;
    this.formulario2.reset();//vaciamos el formulario
    this.spinner.show();//Mostramos el loading
    this.GetSubscription = this.service.getCliente(id).subscribe((res: any) => {
      //dentro del subscribe estaran los datos consultados de la api, fuera de este no tendras nada
      this.cliente = res;
      //console.log(this.cliente);
      //console.log(this.administrador);
      this.presentandoDatos();
    });
  }

  presentandoDatos() {
    this.formulario2.patchValue({
      nombreLocal: this.cliente.nombreLocal,
      nombrePropietario: this.cliente.nombrePropietario,
      nombreEncargado: this.cliente.nombreEncargado,
      telefono: this.cliente.telefono,
      direccion: this.cliente.direccion,
      municipio: this.cliente.municipio,
      estado: this.cliente.estado,
      porcentajeDescuento: this.cliente.porcentajeDescuento,
      porcentajeDescuento2: this.cliente.porcentajeDescuento2
    });
    this.cerrarLoading();
  }

  agregar() {
    this.spinner.show();//Mostramos el loading
    //console.log('con que quieres agregar verdad prro!!');
    let cliente = new Cliente();
    cliente.nombreLocal = this.formulario2.value.nombreLocal;
    cliente.nombrePropietario = this.formulario2.value.nombrePropietario;
    cliente.nombreEncargado = this.formulario2.value.nombreEncargado;
    cliente.telefono = this.formulario2.value.telefono;
    cliente.direccion = this.formulario2.value.direccion;
    cliente.municipio = this.formulario2.value.municipio;
    cliente.estado = this.formulario2.value.estado;
    cliente.porcentajeDescuento = this.formulario2.value.porcentajeDescuento;
    cliente.porcentajeDescuento2 = this.formulario2.value.porcentajeDescuento2;
    //console.log(cliente);
    this.PostSubscription = this.service.postCliente(cliente).subscribe((res: any) => {
      //console.log(res);
      this.cerrarLoading();
      let mensaje = 'Se agregó el cliente con exito!!';
      this.mensajeExito(mensaje);
    }, (error: any) => {
      this.cerrarLoading();
      //console.log(error);
      let mensajeErrorConEtiquetas = error.error.messages.error;
      let mensajeError = mensajeErrorConEtiquetas.replace(/<[^>]*>?/g, '');
      this.mensajeError(mensajeError);
    });
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

  editar() {
    let opcion = 2;
    let titulo = "¿Esta seguro que desea editar este cliente?";
    let texto = "¡Esto va actualizar el registro!";
    let textoBtnConfirm = "¡Si, editar!"
    let textoBtnCancel = "¡No, cancelar!"
    this.mensajeDialogo(opcion, titulo, texto, textoBtnConfirm, textoBtnCancel);
  }

  eliminacionConfirmada() {
    this.spinner.show();//Mostramos el loading
    this.DeleteSubscription = this.service.deleteCliente(this.cliente.id).subscribe((res: any) => {
      //console.log(res);
      this.cerrarLoading();
      let mensaje = 'Se eliminó el cliente con exito!!';
      this.mensajeExito(mensaje);
    }, (error: any) => {
      this.cerrarLoading();
      //console.log(error);
      let mensajeErrorConEtiquetas = error.error.messages.error;
      let mensajeError = mensajeErrorConEtiquetas.replace(/<[^>]*>?/g, '');
      this.mensajeError(mensajeError);
    });
  }

  editarConfirmado() {
    //this.mensajeDialogo(opcion, titulo, texto, textoBtnConfirm, textoBtnCancel);
    this.spinner.show();//Mostramos el loading
    //console.log('con que quieres agregar verdad prro!!');
    let cliente = new Cliente();
    cliente.nombreLocal = this.formulario2.value.nombreLocal;
    cliente.nombrePropietario = this.formulario2.value.nombrePropietario;
    cliente.nombreEncargado = this.formulario2.value.nombreEncargado;
    cliente.telefono = this.formulario2.value.telefono;
    cliente.direccion = this.formulario2.value.direccion;
    cliente.municipio = this.formulario2.value.municipio;
    cliente.estado = this.formulario2.value.estado;
    cliente.porcentajeDescuento = this.formulario2.value.porcentajeDescuento;
    cliente.porcentajeDescuento2 = this.formulario2.value.porcentajeDescuento2;
    //console.log(cliente);
    this.PutSubscription = this.service.putCliente(cliente, this.cliente.id).subscribe((res: any) => {
      //console.log(res);
      this.cerrarLoading();
      let mensaje = 'Se editó el cliente con exito!!';
      this.mensajeExito(mensaje);
    }, (error: any) => {
      this.cerrarLoading();
      //console.log(error);
      let mensajeErrorConEtiquetas = error.error.messages.error;
      let mensajeError = mensajeErrorConEtiquetas.replace(/<[^>]*>?/g, '');
      this.mensajeError(mensajeError);
    });
  }

  mensajeDialogo(opcion: number, titulo: string, texto: string, textoBtnConfirm: string, textoBtnCancel: string) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success me-2',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })
    swalWithBootstrapButtons.fire({
      title: titulo,
      text: texto,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: textoBtnConfirm,
      cancelButtonText: textoBtnCancel,
    }).then((result) => {
      if (result.isConfirmed) {
        if (opcion == 1){
          this.eliminacionConfirmada();
        }else {
          this.editarConfirmado();
        }
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'Tu registro está a salvo :)',
          'error'
        )
      }
    })
  }

  eliminar() {
    let opcion = 1;
    let titulo = "¿Esta seguro que desea eliminar este cliente?";
    let texto = "¡Esto no se podrá revertir!";
    let textoBtnConfirm = "¡Si, eliminar!"
    let textoBtnCancel = "¡No, cancelar!"
    this.mensajeDialogo(opcion, titulo, texto, textoBtnConfirm, textoBtnCancel);
  }

  get formularioControl() {//NO borrar
    return this.formulario.controls;
  }

  get formularioControl2() {//NO borrar
    return this.formulario2.controls;
  }

  ngOnDestroy(): void {
    this.GetSubscriptions.unsubscribe();
    if (this.GetSubscription != null || this.GetSubscription != undefined) {
      this.GetSubscription.unsubscribe();
      //console.log('se elimino el get edit')
    }

    if (this.PostSubscription != null || this.PostSubscription != undefined) {
      this.PostSubscription.unsubscribe();
      //console.log('se elimino el post')
    }

    if (this.PutSubscription != null || this.PutSubscription != undefined) {
      this.PutSubscription.unsubscribe();
      //console.log('se elimino el put')
    }

    if (this.DeleteSubscription != null || this.DeleteSubscription != undefined) {
      this.DeleteSubscription.unsubscribe();
      //console.log('se elimino el delete')
    }
    //console.log('Hola se ejecuto el ngOnDestroy')
  }

}
