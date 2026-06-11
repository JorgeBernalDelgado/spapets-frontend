import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistroSpaComponent } from './registro-spa.component'; // <-- Cambiado a RegistroSpaComponent

describe('RegistroSpaComponent', () => {
  let component: RegistroSpaComponent; // <-- Cambiado
  let fixture: ComponentFixture<RegistroSpaComponent>; // <-- Cambiado

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroSpaComponent] // <-- Cambiado
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroSpaComponent); // <-- Cambiado
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});