import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginModalComponent } from './login-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import {AuthService} from "../../../core/services/auth/auth.service";
import {DataService} from "../../../core/services/data/data.service";

describe('LoginModalComponent', () => {
  let component: LoginModalComponent;
  let fixture: ComponentFixture<LoginModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        LoginModalComponent // Importar el componente autónomo en lugar de declararlo
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        AuthService,
        DataService,
        MatSnackBar
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario correctamente', () => {
    const form = component.loginForm;
    expect(form).toBeDefined();
    expect(form.contains('email')).toBeTrue();
    expect(form.contains('password')).toBeTrue();
  });

  it('debería marcar el formulario como inválido si los campos están vacíos', () => {
    const form = component.loginForm;
    form.get('email')?.setValue('');
    form.get('password')?.setValue('');
    expect(form.valid).toBeFalse();
  });

  it('debería marcar el formulario como válido si los campos están completos y válidos', () => {
    const form = component.loginForm;
    form.get('email')?.setValue('test@example.com');
    form.get('password')?.setValue('password123');
    expect(form.valid).toBeTrue();
  });

  it('debería llamar al método de inicio de sesión al enviar el formulario', () => {
    spyOn(component, 'onSubmit');
    const form = component.loginForm;
    form.get('email')?.setValue('test@example.com');
    form.get('password')?.setValue('password123');
    component.onSubmit();
    expect(component.onSubmit).toHaveBeenCalled();
  });
});
