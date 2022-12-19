import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BateriasComponent } from './pages/baterias/baterias.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ConsultarPrecioComponent } from './pages/consultar-precio/consultar-precio.component';
import { HomeComponent } from './pages/home/home.component';
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
    component: HomeComponent
  },
  {
    path: 'clientes',
    component: ClientesComponent
  },
  {
    path: 'usuarios',
    component: UsuariosComponent
  },
  {
    path: 'baterias',
    component: BateriasComponent
  },
  {
    path: 'consultar-precio',
    component: ConsultarPrecioComponent
  },
  {
    path: 'pedidos',
    component: PedidosComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
