import { Component } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { Router, RouterLink } from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from "../../../core/services/auth/auth.service";
import { NgIf } from "@angular/common";

/**
 * @description
 * Este componente maneja el modal de inicio de sesión.
 * Permite a los usuarios iniciar sesión, recuperar contraseñas y registrarse.
 *
 * @usageNotes
 * Utilice este componente para mostrar un modal de inicio de sesión en la aplicación.
 *
 * @example
 * <app-login-modal></app-login-modal>
 */
@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login-modal.component.html',
  styleUrl: './login-modal.component.css'
})
export class LoginModalComponent {

  /**
   * Formulario de inicio de sesión.
   */
  loginForm: FormGroup;

  /**
   * Indicador de validez del usuario.
   */
  isValidUser = true;

  constructor(public dialog: MatDialog,
              private router: Router,
              private fb: FormBuilder,
              private authService: AuthService) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  /**
   * Cierra el modal de inicio de sesión.
   */
  close() {
    this.dialog.closeAll();
  }

  /**
   * Maneja el envío del formulario de inicio de sesión.
   * Si el formulario es válido y las credenciales son correctas, el usuario es redirigido a la página de inicio.
   * De lo contrario, se muestra un mensaje de error.
   */
  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      if (this.authService.login(email, password)) {
        this.dialog.closeAll();
        this.router.navigate(['/home']);
      } else {
        this.isValidUser = false;
      }
    }
  }

  /**
   * Redirige al usuario a la página de recuperación de contraseña y cierra el modal.
   */
  recoverPassword() {
    this.close();
    this.router.navigate(["/recover-password"]);
  }

  /**
   * Redirige al usuario a la página de registro y cierra el modal.
   */
  register() {
    this.close();
    this.router.navigate(["/register"]);
  }
}
