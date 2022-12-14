import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Bateria } from 'src/app/models/Bateria';
import { Details } from 'src/app/models/Details';
import { Grupo } from 'src/app/models/Grupo';
import { BateriaService } from 'src/app/services/bateria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-baterias',
  templateUrl: './baterias.component.html',
  styleUrls: ['./baterias.component.css']
})
export class BateriasComponent implements OnInit {

  formulario: any;
  formulario2: any;
  estaEnGestion: boolean = false;
  estaBuscando = false;
  buscar = '';
  urlBaseBusqueda = 'http://localhost:8080/api/baterias/busqueda';
  urlBase = 'http://localhost:8080/api/baterias';
  url = 'http://localhost:8080/api/baterias';
  baterias: Bateria[] = [];
  grupos: Grupo[] = [];
  bateria: Bateria | any;
  details: Details | any;//por objeto
  numbers: number[] = [];
  GetSubscriptions: Subscription | any;
  GetSubscriptions2: Subscription | any;
  GetSubscription: Subscription | any;
  PostSubscription: Subscription | any;
  PutSubscription: Subscription | any;
  DeleteSubscription: Subscription | any;

  constructor(private service: BateriaService, private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit(): void {
    this.obtenerBaterias();
    this.obtenerGrupos();
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
    this.formulario2 = new FormGroup({
      idCostoGrupo: new FormControl('', [
        Validators.required
      ]),
      tipo: new FormControl('', [
        Validators.required,
        Validators.pattern("[a-zA-ZÑñ0-9 /*()-]{3,45}"),//()/*\-
        Validators.minLength(3),
        Validators.maxLength(45)
      ]),
      precioUsadoIva: new FormControl('', [
        Validators.required,
        Validators.pattern("([0-9]{1,5})(.{1}[0-9]{1,2})?"),
        Validators.minLength(3),
        Validators.maxLength(8)
      ])
    });
    //console.log(this.formulario);
  }

  obtenerBateriasBase() {
    this.estaBuscando = false;
    this.formulario.reset();
    this.spinner.show();//Mostramos el loading
    this.GetSubscriptions = this.service.getBaterias().subscribe((res: any) => {
      this.baterias = res.baterias;
      this.details = res.getDetails;
      //console.log(this.baterias);
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

  obtenerBaterias() {
    this.spinner.show();//Mostramos el loading
    //console.log(this.url)
    this.GetSubscriptions = this.service.getBaterias2(this.url).subscribe((res: any) => {
      this.baterias = res.baterias;
      this.details = res.getDetails;
      //console.log(this.baterias);
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

  obtenerGrupos() {
    this.GetSubscriptions2 = this.service.getGrupos().subscribe((res: any) => {
      this.grupos = res;
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

  mostrarOtrosBaterias(otroUrl: string) {
    //console.log(otroUrl);
    this.url = otroUrl;
    //console.log(this.url);
    this.obtenerBaterias();
  }

  mostrarOtrosBaterias2(otroUrl: string) {//para el boton de busqueda
    //console.log(otroUrl);
    this.estaBuscando = true;
    this.buscar = this.formularioControl.busqueda.value;
    this.url = otroUrl + '/' + this.formularioControl.busqueda.value;
    this.obtenerBaterias();
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

  entroEnAgregar() {
    this.estaEnGestion = false;
    this.formulario2.reset();//vaciamos el formulario
  }

  entroEnGestion(id: number | undefined) {
    this.estaEnGestion = true;
    this.formulario2.reset();//vaciamos el formulario
    this.spinner.show();//Mostramos el loading
    this.GetSubscription = this.service.getBateria(id).subscribe((res: any) => {
      //dentro del subscribe estaran los datos consultados de la api, fuera de este no tendras nada
      this.bateria = res;
      //console.log(this.bateria);
      //console.log(this.administrador);
      this.presentandoDatos();
    });
  }

  presentandoDatos() {
    this.formulario2.patchValue({
      idCostoGrupo: this.bateria.nombreLocal,
      tipo: this.bateria.nombrePropietario,
      precioUsadoIva: this.bateria.nombreEncargado
    });
    this.cerrarLoading();
  }

  agregar() {
    this.spinner.show();//Mostramos el loading
    //console.log('con que quieres agregar verdad prro!!');
    let bateria = new Bateria();
    bateria.idCostoGrupo = this.formulario2.value.idCostoGrupo;
    bateria.precioUsadoIva = this.formulario2.value.precioUsadoIva;
    bateria.tipo = this.formulario2.value.tipo;
    //console.log(bateria);
    this.PostSubscription = this.service.postBateria(bateria).subscribe((res: any) => {
      //console.log(res);
      this.cerrarLoading();
      let mensaje = 'Se agregó el bateria con exito!!';
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
    let titulo = "¿Esta seguro que desea editar este bateria?";
    let texto = "¡Esto va actualizar el registro!";
    let textoBtnConfirm = "¡Si, editar!"
    let textoBtnCancel = "¡No, cancelar!"
    this.mensajeDialogo(opcion, titulo, texto, textoBtnConfirm, textoBtnCancel);
  }

  eliminacionConfirmada() {
    this.spinner.show();//Mostramos el loading
    this.DeleteSubscription = this.service.deleteBateria(this.bateria.id).subscribe((res: any) => {
      //console.log(res);
      this.cerrarLoading();
      let mensaje = 'Se eliminó el bateria con exito!!';
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
    let bateria = new Bateria();
    bateria.idCostoGrupo = this.formulario2.value.idCostoGrupo;
    bateria.precioUsadoIva = this.formulario2.value.precioUsadoIva;
    bateria.tipo = this.formulario2.value.tipo;
    //console.log(bateria);
    this.PutSubscription = this.service.putBateria(bateria, this.bateria.id).subscribe((res: any) => {
      //console.log(res);
      this.cerrarLoading();
      let mensaje = 'Se editó el bateria con exito!!';
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
    let titulo = "¿Esta seguro que desea eliminar este bateria?";
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
    this.GetSubscriptions2.unsubscribe();
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
