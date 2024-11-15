import { Component, Input } from '@angular/core';
import {CurrencyPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import { Products } from "../../models/products";
import { CartService } from "../../../core/services/cart/cart.service";
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from "@angular/material/snack-bar";
import { CustomCurrencyPipe } from "../../pipes/customCurrency";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

/**
 * @description
 * Este componente se encarga de mostrar una cuadrícula de productos.
 * Cada producto puede ser agregado al carrito de compras.
 *
 * @usageNotes
 * Este componente debe ser utilizado para mostrar listas de productos divididas en secciones.
 *
 *
 * @example
 * <app-grid [chunkedProducts]="products" title="Productos destacados"></app-grid>
 */
@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [
    CurrencyPipe,
    NgForOf,
    NgClass,
    CustomCurrencyPipe,
    MatProgressSpinner,
    NgIf
  ],
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css'
})
export class GridComponent {

  /**
   * Posición horizontal de la notificación.
   */
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';

  /**
   * Posición vertical de la notificación.
   */
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(private cartService: CartService,
              private snackBar: MatSnackBar) {}

  /**
   * Productos divididos en secciones para mostrar en la cuadrícula.
   */
  @Input()
  chunkedProducts: Products[][] = [];

  /**
   * Título de la cuadrícula.
   */
  @Input()
  title: string = '';

  /**
   * Variable para mostrar/ocular spinner.
   */
  @Input()
  loading: boolean = true;

  /**
   * Devuelve una lista de clases CSS para las estrellas de calificación.
   *
   * @param rating La calificación del producto.
   * @returns Una lista de clases CSS.
   */
  getStars(rating: number): string[] {
    return Array.from({ length: 5 }, (_, i) => i < rating ? 'fas fa-star text-warning' : 'far fa-star text-warning');
  }

  /**
   * Agrega un producto al carrito de compras y muestra una notificación.
   *
   * @param product El producto a agregar al carrito.
   */
  addToCart(product: Products): void {
    this.cartService.addToCart(product);
    this.snackBar.open('Producto agregado al carrito!', '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 3000,
      panelClass: ['custom-snackbar']
    });
  }

}
