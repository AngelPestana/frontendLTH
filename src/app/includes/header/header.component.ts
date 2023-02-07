import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userAccedio: boolean = false;
  nombre: string | null = null;
  idRol: string | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    window.addEventListener("scroll", function () {
      let nav = this.document.querySelector("nav");
      nav?.classList.toggle("bajo", this.window.scrollY > 0)
    });
    this.accedio();
    this.checarExpiracion();
    //console.log(this.router.url);
  }

  accedio(): void {
    let token = localStorage.getItem('token');
    if (token != null) {
      this.userAccedio = true;
      this.nombre = localStorage.getItem('nombre');
      this.idRol = localStorage.getItem('idRol');
    }
  }

  checarExpiracion() {
    let date = new Date();
    let time = date.getTime();
    let tiempoExpirado = localStorage.getItem('tiempoExpirado')
    if (tiempoExpirado != null) {
      let timeExpiradoInt = parseInt(tiempoExpirado);
      if (time >= timeExpiradoInt) {
        this.salirPorSesionExpirada();
      }
    }
  }

  salir(): void {
    localStorage.clear();
    this.userAccedio = false;
    this.nombre = null;
    this.idRol = null;
    this.mensajeCerroSesion();
  }

  salirPorSesionExpirada() {
    localStorage.clear();
    this.userAccedio = false;
    this.nombre = null;
    this.idRol = null;
    this.mensajeCerroSesionPorExpiracion();
  }

  mensajeCerroSesionPorExpiracion() {
    Swal.fire({
      title: 'Sesión cerrada por expiración de la sesión!',
      text: 'si gusta seguir, favor de iniciar sesión nuevamente',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let rutaActual = this.router.url
        if (rutaActual == '/home') {
          window.location.reload();//Para que actualice y se muestre la opcion de iniciar sesion en el home
        } else {//si no esta en home, entonces que rediriga
          this.router.navigate(['/home']);
        }
      }
    });
  }

  mensajeCerroSesion() {
    Swal.fire({
      title: 'Sesión cerrada, vuelva pronto!',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        let rutaActual = this.router.url
        if (rutaActual == '/home') {
          window.location.reload();//Para que actualice y se muestre la opcion de iniciar sesion en el home
        } else {//si no esta en home, entonces que rediriga
          this.router.navigate(['/home']);
        }
      }
    });
  }


}
