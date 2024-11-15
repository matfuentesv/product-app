import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from "@angular/router";
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { NgIf, NgOptimizedImage } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { LoginModalComponent } from "../../shared/components/login-modal/login-modal.component";
import { AuthService } from "../../core/services/auth/auth.service";
import { CartService } from "../../core/services/cart/cart.service";
import { filter } from "rxjs";


@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [
    RouterOutlet,
    FooterComponent,
    RouterLink,
    NgOptimizedImage,
    NgIf
  ],
  templateUrl: './pages.component.html',
  styleUrl: './pages.component.css'
})
export class PagesComponent implements OnInit {


  userName: string | null = null;
  userRole: string | null = null;


  cartItemCount: number = 0;


  constructor(
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private cartService: CartService,
    public dialog: MatDialog
  ) {}


  ngOnInit(): void {
    this.authService.userName$.subscribe(userName => {
      this.userName = userName;
      this.cdr.detectChanges();
    });

    this.authService.userRole$.subscribe(userRole => {
      this.userRole = userRole;
      this.cdr.detectChanges();
    });

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.userName = this.authService.getUserName();
        this.userRole = this.authService.getUserRole();
        this.cdr.detectChanges();
      });

    this.cartService.getCartItemCount().subscribe(count => {
      this.cartItemCount = count;
    });
  }


  openModal() {
    this.dialog.open(LoginModalComponent, {});
  }


  logout() {
    this.authService.logout();
    this.userName = null;
    this.userRole = null;
    this.cdr.detectChanges();
  }
}
