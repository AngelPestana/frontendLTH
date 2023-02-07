import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardAccessGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (localStorage.getItem('token') != null && localStorage.getItem('nombre') != null && localStorage.getItem('idRol') != null && localStorage.getItem('tiempoExpirado') != null) {
        return true;
      }else if (localStorage.getItem('token') == null && localStorage.getItem('nombre') == null && localStorage.getItem('id_rol') == null && localStorage.getItem('tiempoExpirado') == null) {
        //este guardian debe dejar que el publico vea la pagina de home es por ello que tambien aceptamos el null en el localstorage
        return true;
      }else {
        localStorage.clear();//que limpie todo y que el usuario vuelva a acceder
        this.redireccionar();
        return false;
      }
    //return true;
  }

  redireccionar() {
    let rutaActual = this.router.url
    if (rutaActual == '/home') {
      window.location.reload();//Para que actualice y se muestre la opcion de iniciar sesion en el home
    } else {//si no esta en home, entonces que rediriga
      this.router.navigate(['/home']);
    }
    //this.router.navigate(['/acceso']);
  }
  
}
