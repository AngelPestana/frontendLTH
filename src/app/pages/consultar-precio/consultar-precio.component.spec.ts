import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarPrecioComponent } from './consultar-precio.component';

describe('ConsultarPrecioComponent', () => {
  let component: ConsultarPrecioComponent;
  let fixture: ComponentFixture<ConsultarPrecioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultarPrecioComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarPrecioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
