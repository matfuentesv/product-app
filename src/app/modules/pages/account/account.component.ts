import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from "@angular/forms";
import { AuthService } from "../../../core/services/auth/auth.service";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { NgClass, NgIf } from "@angular/common";
import {DataService} from "../../../core/services/data/data.service";
import {Ng2Rut2, RutValidatorDirective} from '../../../shared/directives/ng2-rut/ng2-rut.module';
import {User} from '../../../shared/models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgClass,
    Ng2Rut2
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit {


  accountForm: FormGroup;
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  users: User[]=[];
  objectUser: User | null | undefined;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private snackBar: MatSnackBar,
              private dataService: DataService) {

    this.accountForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      rut: ['', [Validators.required, RutValidatorDirective.validate]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      password: ['', [
        Validators.required,
        Validators.pattern('^(?=.*[A-Z])(?=.*\\d).{6,18}$'),
        Validators.minLength(6),
        Validators.maxLength(18)
      ]]
    });
  }


  ngOnInit(): void {
    this.objectUser = this.authService.getUser();
    this.users = this.authService.loadUsers();

    if (this.objectUser) {
      this.accountForm.patchValue({
        firstName: this.objectUser.firstName,
        lastName: this.objectUser.lastName,
        rut: this.objectUser.rut,
        email: this.objectUser.email,
        phone: this.objectUser.phone,
        address: this.objectUser.address,
        password: this.objectUser.password
      });
    }
  }


  get validFirstName(){
    return this.accountForm.get('firstName')?.invalid && this.accountForm.get('firstName')?.touched;
  }


  get validLastName(){
    return this.accountForm.get('lastName')?.invalid && this.accountForm.get('lastName')?.touched;
  }


  get validRut(){
    return this.accountForm.get('rut')?.invalid && this.accountForm.get('rut')?.touched;
  }



  get validEmail(){
    return this.accountForm.get('email')?.invalid && this.accountForm.get('email')?.touched;
  }


  get validPhone(){
    return this.accountForm.get('phone')?.invalid && this.accountForm.get('phone')?.touched;
  }


  get validAddress(){
    return this.accountForm.get('address')?.invalid && this.accountForm.get('address')?.touched;
  }


  get validPassword(){
    return this.accountForm.get('password')?.invalid && this.accountForm.get('password')?.touched;
  }


  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }


  onSubmit(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, actualizar!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (this.accountForm.valid) {

          const index = this.users.findIndex((elemento: any) => elemento.id === this.objectUser?.id);

          if (index !== -1) {
            this.users[index].firstName = this.accountForm.get('firstName')?.value;
            this.users[index].lastName = this.accountForm.get('lastName')?.value;
            this.users[index].rut = this.accountForm.get('rut')?.value;
            this.users[index].email = this.accountForm.get('email')?.value;
            this.users[index].phone = this.accountForm.get('phone')?.value;
            this.users[index].address = this.accountForm.get('address')?.value;
            this.users[index].password = this.accountForm.get('password')?.value;
            this.users[index].roles = this.objectUser?.roles ?? [];
            this.dataService.addUser(this.users).subscribe(rsp => {
              this.authService.isLoggedIn.next(true);
              this.authService.userNameSubject.next(this.users[index].firstName);
              this.authService.userRoleSubject.next(this.users[index].roles.includes('admin') ? 'admin' : 'customer');
              this.authService.currentUser = this.users[index];
              this.snackBar.open('Usuario actualizado correctamente!', '', {
                horizontalPosition: this.horizontalPosition,
                verticalPosition: this.verticalPosition,
                duration: 3000,
                panelClass: ['custom-snackbar']
              });
            });
            }
          }
      }
    });
  }

  validateNumbers(event: { charCode: number; }){
    return (event.charCode >= 48 && event.charCode <= 57) || event.charCode === 107;
  }
  async loadUsers() {
    try {
      await this.dataService.getUsers().toPromise();
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }



}
