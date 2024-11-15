import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {NgClass, NgIf} from "@angular/common";


@Component({
  selector: 'app-recover-password',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    NgIf,
    NgClass
  ],
  templateUrl: './recover-password.component.html',
  styleUrl: './recover-password.component.css'
})
export class RecoverPasswordComponent implements OnInit {


  recover!: FormGroup;


  horizontalPosition: MatSnackBarHorizontalPosition = 'start';


  verticalPosition: MatSnackBarVerticalPosition = 'bottom';


  constructor(private fb: FormBuilder,
              private snackBar: MatSnackBar) {}


  ngOnInit(): void {
    this.recover = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }


  get validEmail(){
    return this.recover.get('email')?.invalid && this.recover.get('email')?.touched;
  }


  onSubmit(): void {
    if (this.recover.valid) {
      this.snackBar.open('Contraseña enviada con exito!', '', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000,
        panelClass: ['custom-snackbar']
      });
    } else {
      Object.values(this.recover.controls).forEach(control => {
        control.markAsTouched();
      });
    }
  }

}
