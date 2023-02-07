import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Login } from 'src/app/models/Login';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  formulario: any;
  userAccedio: boolean = false

  urlImg: string = '../../assets/img/home/'
  constructor(private spinner: NgxSpinnerService, private login: LoginService) { }

  ngOnInit(): void {
    this.accedio();
    this.formularioReactivo();
  }

  accedio(): void {
    let token = localStorage.getItem('token');
    if (token != null){
      this.userAccedio = true;
    }
  }

  formularioReactivo(): void {
    this.formulario = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(11),
        Validators.pattern('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$')
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern("[a-zA-ZñÑ0-9!?-]{8,15}"),
        Validators.minLength(8),
        Validators.maxLength(15)
      ])
    });
    //console.log(this.formulario);
  }

  entrar(): void {
    //console.log('entrar');
    this.spinner.show();
    let email = this.formulario.value.email;
    let password = this.formulario.value.password;
    let login = new Login();
    login.email = email;
    login.password = password;
    this.login.postLogin(login).subscribe((res: any) => {
      //console.log(res);
      localStorage.setItem('token', res.Token);
      localStorage.setItem('nombre', res.user.nombre);
      localStorage.setItem('idRol', res.user.idRol);
      let date = new Date();
      let time = date.getTime();
      //Recordar que son milisegundos por eso multiplicamos por 1000
      let time2 = time + (((12 * 60 * 60)*1000) - 10000);
      localStorage.setItem('tiempoExpirado', time2.toString());
      //console.log(time2);
      this.cerrarLoading();
      let mensaje = 'Bienvenido ' + res.user.nombre + '!!';
      this.mensajeExito(mensaje);
    }, (error: any) => {
      //console.log(error.error.messages.error);
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
        window.location.reload();//Para que actualice la pagina y haga los cambios
      }
    });
  }

  mensajeError(mensaje: string) {
    Swal.fire({
      icon: 'error',
      title: mensaje,
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    });
  }

  cerrarLoading(): void {
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 500);
  }

  get formularioControl() {//NO borrar
    return this.formulario.controls;
  }

}
