import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgxSpinnerModule } from "ngx-spinner";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './includes/header/header.component';
import { FooterComponent } from './includes/footer/footer.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { BateriasComponent } from './pages/baterias/baterias.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    ClientesComponent,
    UsuariosComponent,
    BateriasComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
