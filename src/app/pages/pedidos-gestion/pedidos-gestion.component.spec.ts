import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosGestionComponent } from './pedidos-gestion.component';

describe('PedidosGestionComponent', () => {
  let component: PedidosGestionComponent;
  let fixture: ComponentFixture<PedidosGestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PedidosGestionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosGestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
