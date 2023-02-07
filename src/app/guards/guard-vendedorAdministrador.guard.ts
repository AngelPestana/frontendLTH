import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardVendedorAdministradorGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (localStorage.getItem('token') != null && localStorage.getItem('nombre') != null && localStorage.getItem('idRol') != null && localStorage.getItem('tiempoExpirado') != null) {
        if (localStorage.getItem('idRol') == '1' || localStorage.getItem('idRol') == '2'){
          return true;
        }else {
          localStorage.clear();//que limpie todo y que el usuario vuelva a acceder
          this.redireccionar();
          return false;
        }
      }else {
        localStorage.clear();//que limpie todo y que el usuario vuelva a acceder
        this.redireccionar();
        return false;
      }
  }

  redireccionar() {
    this.router.navigate(['/home']);
    //this.router.navigate(['/acceso']);
  }
  
}
