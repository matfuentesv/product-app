import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { NgClass, NgIf } from "@angular/common";
import { DataService } from "../../../core/services/data/data.service";
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource
} from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { User } from "../../../shared/models/user";

import { catchError, map, merge, of, startWith, switchMap } from "rxjs";
import {MatProgressSpinner, MatSpinner} from "@angular/material/progress-spinner";
import { MatDialog } from "@angular/material/dialog";
import { UserModalComponent } from "../../../shared/components/user-modal/user-modal.component";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition
} from "@angular/material/snack-bar";
import { Ng2Rut2 } from "../../../shared/directives/ng2-rut/ng2-rut.module";
import {MatButton, MatIconButton} from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import Swal from 'sweetalert2';
import { EditUserModalComponent } from "../../../shared/components/edit-user-modal/edit-user-modal.component";
import {Products} from "../../../shared/models/products";
import {MatListItem, MatNavList} from "@angular/material/list";
import {MatSidenav, MatSidenavContainer, MatSidenavContent} from "@angular/material/sidenav";
import {CustomCurrencyPipe} from "../../../shared/pipes/customCurrency";

interface ProductResponse {
  notebooks: Products[];
  cellPhones: Products[];
  coffeeMakers: Products[];
  airConditioning: Products[];
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatTable,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatHeaderRow,
    MatRow,
    MatCellDef,
    MatRowDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatPaginator,
    MatSpinner,
    NgClass,
    Ng2Rut2,
    MatIconButton,
    MatIcon,
    MatListItem,
    MatButton,
    MatNavList,
    MatSidenavContent,
    MatSidenavContainer,
    MatSidenav,
    CustomCurrencyPipe,
    MatProgressSpinner
  ],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit, AfterViewChecked {

  currentSection: string = 'products';

  productForm: FormGroup;

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';

  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  displayedColumns: string[] = ['firstName', 'lastName', 'rut', 'email', 'phone', 'address', 'roles', 'edit', 'delete'];
  productDisplayedColumns: string[] = ['name', 'price', 'discount', 'description', 'category', 'quantity'];

  dataSource = new MatTableDataSource<User>();
  productDataSource = new MatTableDataSource<Products>();

  resultsLength = 0;
  productResultsLength = 0;

  isLoadingResults = true;

  user: User[] = [];


  loading: boolean = true;

  @ViewChild('userPaginator') userPaginator!: MatPaginator;
  @ViewChild('productPaginator') productPaginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private userService: DataService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.productForm = this.fb.group({
      productName: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      image: ['']
    });
  }

  ngOnInit() {
    this.loadData();
    this.loadProducts();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializePaginator();
    });
  }

  ngAfterViewChecked() {
    this.initializePaginator();
  }

  private initializePaginator() {
    if (this.userPaginator && !this.dataSource.paginator) {
      this.ngZone.runOutsideAngular(() => {
        this.dataSource.paginator = this.userPaginator;
        this.setupPagination(this.userPaginator, 'users');
      });
    }

    if (this.productPaginator && !this.productDataSource.paginator) {
      this.ngZone.runOutsideAngular(() => {
        this.productDataSource.paginator = this.productPaginator;
        this.setupPagination(this.productPaginator, 'products');
      });
    }
  }

  private setupPagination(paginator: MatPaginator, section: string) {
    merge(paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return section === 'users'
            ? this.userService.getUsers().pipe(catchError(() => of([] as User[])))
            : this.userService.getProducts().pipe(catchError(() => of({ notebooks: [], cellPhones: [], coffeeMakers: [], airConditioning: [] } as ProductResponse)));
        }),
        map(data => {
          this.isLoadingResults = false;
          if (section === 'users') {
            return data;
          } else {
            const products = data as ProductResponse;
            return [...products.notebooks, ...products.cellPhones, ...products.coffeeMakers, ...products.airConditioning];
          }
        })
      )
      .subscribe(data => {
        this.ngZone.run(() => {
          if (section === 'users') {
            this.dataSource.data = data as User[];
            this.resultsLength = (data as User[]).length;
          } else {
            this.productDataSource.data = data as Products[];
            this.productResultsLength = (data as Products[]).length;
          }
          this.cdr.detectChanges();
        });
      });
  }


  private loadData() {
    this.loading = true;
    this.userService.getUsers().subscribe(users => {
      this.user = users;
      this.dataSource.data = this.user;
      this.resultsLength = this.user.length;
      this.isLoadingResults = false;
      this.cdr.detectChanges();
      this.loading = false;
    },error => {
      console.error(error);
      this.loading = false;
    });
  }

  private loadProducts() {
    this.loading = true;
    this.userService.getProducts().subscribe((products: ProductResponse) => {
      const allProducts = [
        ...products.notebooks,
        ...products.cellPhones,
        ...products.coffeeMakers,
        ...products.airConditioning
      ];
      this.productDataSource.data = allProducts;
      this.productResultsLength = allProducts.length;
      this.loading = false;
    },error => {
      console.error(error);
      this.loading = false;
    });
  }

  showSection(event: Event, section: string): void {
    event.preventDefault();
    this.currentSection = section;
  }

  onSubmitProduct(): void {
    if (this.productForm.valid) {
      console.log(this.productForm.value);
      this.snackBar.open('Producto agregado con éxito!', '', {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000,
        panelClass: ['custom-snackbar']
      });
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  get validProductName() {
    return this.productForm.get('productName')?.invalid && this.productForm.get('productName')?.touched;
  }

  get validProductDescription() {
    return this.productForm.get('description')?.invalid && this.productForm.get('description')?.touched;
  }

  get validProductPrice() {
    return this.productForm.get('price')?.invalid && this.productForm.get('price')?.touched;
  }

  get validProductCategory() {
    return this.productForm.get('category')?.invalid && this.productForm.get('category')?.touched;
  }

  openModal() {
    const dialogRef = this.dialog.open(UserModalComponent, { data: { users: this.user },disableClose: true });
    dialogRef.afterClosed().subscribe((rsp) => {
     if(rsp ===1){
       this.ngZone.run(() => {
         this.loadData();
       });
     }
    });
  }

  editElement(object: User) {
    const dialogRef = this.dialog.open(EditUserModalComponent, { data: { users: this.user, user: object }, disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      if(result ===1){
        this.ngZone.run(() => {
          this.loadData();
        });
      }
    });
  }

  deleteElement(user: User) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminarlo!'
    }).then((result) => {
      if (result.isConfirmed) {
        const index = this.user.findIndex((x: any) => x.id === user.id);

        if (index !== -1) {
          this.user.splice(index, 1);
          this.userService.addUser(this.user).subscribe((rsp) => {
            this.snackBar.open('¡Usuario eliminado correctamente!', '', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: 3000,
              panelClass: ['custom-snackbar']
            });
            this.loadData();
          });
        }
      }
    });
  }
}
