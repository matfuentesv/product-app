import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogTitle} from "@angular/material/dialog";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {Ng2Rut2, RutValidatorDirective} from "../../directives/ng2-rut/ng2-rut.module";
import {NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from "@angular/material/snack-bar";
import {DataService} from "../../../core/services/data/data.service";
import {User} from "../../models/user";
import {AuthService} from "../../../core/services/auth/auth.service";

@Component({
  selector: 'app-edit-user-modal',
  standalone: true,
    imports: [
        MatDialogTitle,
        MatError,
        MatFormField,
        MatIcon,
        MatIconButton,
        MatInput,
        MatLabel,
        MatOption,
        MatSelect,
        Ng2Rut2,
        NgIf,
        ReactiveFormsModule
    ],
  templateUrl: './edit-user-modal.component.html',
  styleUrl: './edit-user-modal.component.css'
})
export class EditUserModalComponent  implements OnInit{

  /**
   * Formulario del usuario.
   */
  userForm!: FormGroup;
  /**
   * varibale que contiene un arreglo de usuarios.
   */
  users : User[]=[];

  /**
   * varibale que contiene un objeto del usuario.
   */
  objectUser : User;

  /**
   * Posición horizontal del snack bar.
   */
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';

  /**
   * Posición vertical del snack bar.
   */
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  /**
   * varibale que contiene un objeto logeado.
   */
  loggedUser: User | null | undefined;

  constructor(private dialog: MatDialog,
              private fb: FormBuilder,
              private dataService: DataService,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              public dialogRef: MatDialogRef<EditUserModalComponent>) {
    this.users = data.users;
    this.objectUser = data.user;
  }

  /**
   * Inicializa el componente y configura el formulario del usuario.
   */
  ngOnInit(): void {
    this.loggedUser = this.authService.getUser();
    this.userForm = this.fb.group({
      firstName: [this.objectUser.firstName, Validators.required],
      lastName: [this.objectUser.lastName, Validators.required],
      rut: [this.objectUser.rut, [Validators.required, RutValidatorDirective.validate]],
      email: [this.objectUser.email, [Validators.required, Validators.email]],
      phone: [this.objectUser.phone, Validators.required],
      address: [this.objectUser.address, Validators.required],
      password: [this.objectUser.password, [
        Validators.required,
        Validators.pattern('^(?=.*[A-Z])(?=.*\\d).{6,18}$'),
        Validators.minLength(6),
        Validators.maxLength(18)
      ]],
      roles: [this.objectUser.roles[0], Validators.required]
    });
  }



  /**
   * Cierra el modal de usuario.
   */
  close(value: any) {
    this.dialogRef.close(value);
  }


  /**
   * Maneja el envío del formulario del usuario.
   * Si el formulario es válido, el modal se cierra.
   */
  onSubmit() {
    if (this.userForm.valid) {

      const index = this.users.findIndex((elemento: any) => elemento.id === this.objectUser.id);

      if (index !== -1) {
        this.users[index].firstName = this.userForm.get('firstName')?.value;
        this.users[index].lastName = this.userForm.get('lastName')?.value;
        this.users[index].rut = this.userForm.get('rut')?.value;
        this.users[index].email = this.userForm.get('email')?.value;
        this.users[index].phone = this.userForm.get('phone')?.value;
        this.users[index].address = this.userForm.get('address')?.value;
        this.users[index].password = this.userForm.get('password')?.value;
        this.users[index].roles = [this.userForm.get('roles')?.value];

        this.dataService.addUser(this.users).subscribe(rsp => {
          this.snackBar.open('Usuario actualizado correctamente!', '', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 3000,
            panelClass: ['custom-snackbar']
          });

          if(this.loggedUser?.id === this.users[index].id){
            this.authService.isLoggedIn.next(true);
            this.authService.userNameSubject.next(this.users[index].firstName);
            this.authService.userRoleSubject.next(this.users[index].roles.includes('admin') ? 'admin' : 'customer');
            this.authService.currentUser = this.users[index];
          }

          this.close(1);
        })
      }

    }
  }

  validateNumbers(event: { charCode: number; }){
    return (event.charCode >= 48 && event.charCode <= 57) || event.charCode === 107;
  }

}
