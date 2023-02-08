import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  userAccedio: boolean = false;
  nombre: string | null = null;
  idRol: string | null = null;

  constructor() { }

  ngOnInit(): void {
    this.accedio();
  }

  accedio(): void {
    let token = localStorage.getItem('token');
    if (token != null) {
      this.userAccedio = true;
      this.nombre = localStorage.getItem('nombre');
      this.idRol = localStorage.getItem('idRol');
    }
  }

}
