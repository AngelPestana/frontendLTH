import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Details } from 'src/app/models/Details';
import { Rol } from 'src/app/models/Rol';
import { Usuario } from 'src/app/models/Usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  formulario: any;
  formulario2: any;
  estaEnGestion: boolean = false;
  estaBuscando = false;
  buscar = '';
  urlBaseBusqueda = 'http://localhost:8080/api/usuarios/search';
  urlBase = 'http://localhost:8080/api/usuarios';
  url = 'http://localhost:8080/api/usuarios';
  usuarios: Usuario[] = [];
  roles: Rol[] = [];
  usuario: Usuario | any;
  details: Details | any;//por objeto
  numbers: number[] = [];
  GetSubscriptions: Subscription | any;
  GetSubscriptions2: Subscription | any;//para los roles
  GetSubscription: Subscription | any;
  PostSubscription: Subscription | any;
  PutSubscription: Subscription | any;
  DeleteSubscription: Subscription | any;

  constructor(private service: UsuarioService, private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit(): void {
    this.obtenerUsuarios();
    this.obtenerRoles();
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
      nombre: new FormControl('', [
        Validators.required,
        Validators.pattern("[a-zA-ZñÑ ]{3,45}"),
        Validators.minLength(3),
        Validators.maxLength(45)
      ]),
      apellidos: new FormControl('', [
        Validators.required,
        Validators.pattern("[a-zA-ZñÑ ]{3,45}"),
        Validators.minLength(3),
        Validators.maxLength(45)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$"),
        Validators.minLength(11),
        Validators.maxLength(45)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern("[a-zA-ZñÑ0-9!?-]{8,12}"),
        Validators.minLength(8),
        Validators.maxLength(12)
      ]),
      idRol: new FormControl('', [
        Validators.required
      ])
    });
    //console.log(this.formulario);
  }

  obtenerUsuariosBase() {
    this.estaBuscando = false;
    this.formulario.reset();
    this.spinner.show();//Mostramos el loading
    this.GetSubscriptions = this.service.getUsuarios().subscribe((res: any) => {
      this.usuarios = res.usuarios;
      this.details = res.getDetails;
      //console.log(this.usuarios);
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

  obtenerUsuarios() {
    this.spinner.show();//Mostramos el loading
    //console.log(this.url)
    this.GetSubscriptions = this.service.getUsuarios2(this.url).subscribe((res: any) => {
      this.usuarios = res.usuarios;
      this.details = res.getDetails;
      //console.log(this.usuarios);
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

  obtenerRoles() {
    this.GetSubscriptions2 = this.service.getRoles().subscribe((res: any) => {
      this.roles = res;
      //console.log(this.usuarios);
      //console.log(this.details);
      //console.log('siguiente: ' + this.details.next);
      //console.log('anterior: ' + this.details.previous);
      //this.cerrarLoading();
    }, ((error: any) => {
      //console.log(error);
      //this.cerrarLoading();
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

  mostrarOtrosUsuarios(otroUrl: string) {
    //console.log(otroUrl);
    this.url = otroUrl;
    //console.log(this.url);
    this.obtenerUsuarios();
  }

  mostrarOtrosUsuarios2(otroUrl: string) {//para el boton de busqueda
    //console.log(otroUrl);
    this.estaBuscando = true;
    this.buscar = this.formularioControl.busqueda.value;
    this.url = otroUrl + '/' + this.formularioControl.busqueda.value;
    this.obtenerUsuarios();
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
    this.GetSubscription = this.service.getUsuario(id).subscribe((res: any) => {
      //dentro del subscribe estaran los datos consultados de la api, fuera de este no tendras nada
      this.usuario = res;
      //console.log(this.usuario);
      //console.log(this.administrador);
      this.presentandoDatos();
    });
  }

  presentandoDatos() {
    this.formulario2.patchValue({
      nombre: this.usuario.nombre,
      apellidos: this.usuario.apellidos,
      email: this.usuario.email,
      idRol: this.usuario.idRol,
    });
    this.cerrarLoading();
  }

  agregar() {
    this.spinner.show();//Mostramos el loading
    //console.log('con que quieres agregar verdad prro!!');
    let usuario = new Usuario();
    usuario.nombre = this.formulario2.value.nombre;
    usuario.apellidos = this.formulario2.value.apellidos;
    usuario.email = this.formulario2.value.email;
    /*if (this.usuario['email'] != this.formulario2.value.email) {
      usuario.email = this.formulario2.value.email;
    }*/
    usuario.password = this.formulario2.value.password;
    usuario.idRol = this.formulario2.value.idRol;
    //console.log(usuario);
    this.PostSubscription = this.service.postUsuario(usuario).subscribe((res: any) => {
      //console.log(res);
      this.cerrarLoading();
      let mensaje = 'Se agregó el usuario con exito!!';
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
    let titulo = "¿Esta seguro que desea editar este usuario?";
    let texto = "¡Esto va actualizar el registro!";
    let textoBtnConfirm = "¡Si, editar!"
    let textoBtnCancel = "¡No, cancelar!"
    this.mensajeDialogo(opcion, titulo, texto, textoBtnConfirm, textoBtnCancel);
  }

  eliminacionConfirmada() {
    this.spinner.show();//Mostramos el loading
    this.DeleteSubscription = this.service.deleteUsuario(this.usuario.id).subscribe((res: any) => {
      //console.log(res);
      this.cerrarLoading();
      let mensaje = 'Se eliminó el usuario con exito!!';
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
    let usuario = new Usuario();
    usuario.nombre = this.formulario2.value.nombre;
    usuario.apellidos = this.formulario2.value.apellidos;
    if (this.usuario['email'] != this.formulario2.value.email){//Si hay un gmail diferente entonces realiza el cambio
      usuario.email = this.formulario2.value.email;
      console.log('edito gmail');
    }
    if (this.formulario2.value.password !== null){
      //console.log(this.formulario2.value.password);
      usuario.password = this.formulario2.value.password;
      //console.log('Entro en contraseña');
    }
    usuario.idRol = this.formulario2.value.idRol;
    //console.log(usuario);
    this.PutSubscription = this.service.putUsuario(usuario, this.usuario.id).subscribe((res: any) => {
      //console.log(res);
      this.cerrarLoading();
      let mensaje = 'Se editó el usuario con exito!!';
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
    let titulo = "¿Esta seguro que desea eliminar este usuario?";
    let texto = "¡Esto no se podrá revertir!";
    let textoBtnConfirm = "¡Si, eliminar!"
    let textoBtnCancel = "¡No, cancelar!"
    this.mensajeDialogo(opcion, titulo, texto, textoBtnConfirm, textoBtnCancel);
  }

  validacionEdicion():boolean {
    if ((this.formulario2.controls.password.status === 'INVALID' || this.formulario2.controls.password.status === 'VALID') && this.formulario2.controls.nombre.status === 'VALID' && this.formulario2.controls.apellidos.status === 'VALID' && this.formulario2.controls.email.status === 'VALID' && this.formulario2.controls.idRol.status === 'VALID') {
      return false;
    }
    return true;
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
