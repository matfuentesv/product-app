import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {AuthService} from "../../../core/services/auth/auth.service";
import {DataService} from "../../../core/services/data/data.service";


describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        RouterTestingModule,
        RegisterComponent
      ],
      providers: [AuthService, DataService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Inicializa el componente y su formulario
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente', () => {
    const form = component.registerForm;
    console.log('Formulario inicializado:', form);
    expect(form).toBeDefined();
    expect(form.contains('firstName')).toBeTrue();
    expect(form.contains('lastName')).toBeTrue();
    expect(form.contains('rut')).toBeTrue();
    expect(form.contains('phone')).toBeTrue();
    expect(form.contains('email')).toBeTrue();
    expect(form.contains('address')).toBeTrue();
    expect(form.contains('password')).toBeTrue();
    expect(form.contains('promo')).toBeTrue();
  });

  it('debería marcar el formulario como inválido si los campos están vacíos', () => {
    const form = component.registerForm;
    form.get('firstName')?.setValue('');
    form.get('lastName')?.setValue('');
    form.get('email')?.setValue('');
    form.get('password')?.setValue('');
    form.get('confirmPassword')?.setValue('');
    console.log('Formulario inválido:', form.valid);
    expect(form.valid).toBeFalse();
  });



  it('debería llamar al método de envío al enviar el formulario', () => {
    spyOn(component, 'onSubmit').and.callThrough();
    const form = component.registerForm;
    form.get('firstName')?.setValue('John');
    form.get('lastName')?.setValue('Doe');
    form.get('email')?.setValue('john.doe@example.com');
    form.get('password')?.setValue('Password1');
    form.get('confirmPassword')?.setValue('Password1');
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    expect(component.onSubmit).toHaveBeenCalled();
  });
});
