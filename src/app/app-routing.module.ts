import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GuardAccessGuard } from './guards/guard-access.guard';
import { GuardAdministradorGuard } from './guards/guard-administrador.guard';
import { GuardVendedorAdministradorGuard } from './guards/guard-vendedorAdministrador.guard';
import { BateriasComponent } from './pages/baterias/baterias.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ConsultarPrecioComponent } from './pages/consultar-precio/consultar-precio.component';
import { HomeComponent } from './pages/home/home.component';
import { PedidosGestionComponent } from './pages/pedidos-gestion/pedidos-gestion.component';
import { PedidosComponent } from './pages/pedidos/pedidos.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';

const routes: Routes = [
  { 
    path: '',
    redirectTo: '/home',
    pathMatch: 'full' 
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [GuardAccessGuard]
  },
  {
    path: 'clientes',
    component: ClientesComponent,
    canActivate: [GuardVendedorAdministradorGuard]
  },
  {
    path: 'usuarios',
    component: UsuariosComponent,
    canActivate: [GuardAdministradorGuard]
  },
  {
    path: 'baterias',
    component: BateriasComponent,
    canActivate: [GuardVendedorAdministradorGuard]
  },
  {
    path: 'consultar-precio',
    component: ConsultarPrecioComponent,
    canActivate: [GuardVendedorAdministradorGuard]
  },
  {
    path: 'pedidos',
    component: PedidosComponent,
    canActivate: [GuardVendedorAdministradorGuard]
  },
  {
    path: 'pedidos-gestion',
    component: PedidosGestionComponent,
    canActivate: [GuardVendedorAdministradorGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
