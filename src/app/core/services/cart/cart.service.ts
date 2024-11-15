import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Products } from "../../../shared/models/products";

/**
 * @description
 * Servicio para gestionar las operaciones del carrito de compras.
 *
 * @usageNotes
 * Este servicio se utiliza para agregar, eliminar, y actualizar productos en el carrito de compras, así como para obtener la cantidad de productos en el carrito.
 *
 * @example
 * ```typescript
 * constructor(private cartService: CartService) {}
 *
 * this.cartService.addToCart(product);
 * this.cartService.removeItem(productName);
 * this.cartService.updateQuantity(productName, quantity);
 * this.cartService.clearCart();
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: Products[] = [];
  private cartItemCount = new BehaviorSubject<number>(0);

  constructor() { }

  /**
   * Obtiene la cantidad de artículos en el carrito como un observable.
   *
   * @returns Observable de la cantidad de artículos en el carrito.
   */
  getCartItemCount() {
    return this.cartItemCount.asObservable();
  }

  /**
   * Agrega un producto al carrito. Si el producto ya está en el carrito, incrementa la cantidad.
   *
   * @param product El producto a agregar al carrito.
   */
  addToCart(product: Products): void {
    const existingProduct = this.items.find(item => item.name === product.name);
    if (existingProduct) {
      existingProduct.quantity = (existingProduct.quantity || 0) + 1;
    } else {
      this.items.push({ ...product, quantity: 1 });
    }
    this.cartItemCount.next(this.items.reduce((acc, item) => acc + (item.quantity || 0), 0));
  }

  /**
   * Obtiene los productos en el carrito.
   *
   * @returns Un array de productos en el carrito.
   */
  getItems(): Products[] {
    return this.items;
  }

  /**
   * Limpia el carrito eliminando todos los productos.
   *
   * @returns Un array vacío después de limpiar el carrito.
   */
  clearCart(): Products[] {
    this.items = [];
    this.cartItemCount.next(0);
    return this.items;
  }

  /**
   * Elimina un producto del carrito por su nombre.
   *
   * @param productName El nombre del producto a eliminar del carrito.
   */
  removeItem(productName: string): void {
    this.items = this.items.filter(item => item.name !== productName);
    this.cartItemCount.next(this.items.reduce((acc, item) => acc + (item.quantity || 0), 0));
  }

  /**
   * Actualiza la cantidad de un producto en el carrito.
   *
   * @param productName El nombre del producto cuya cantidad se va a actualizar.
   * @param quantity La nueva cantidad del producto.
   */
  updateQuantity(productName: string, quantity: number): void {
    const product = this.items.find(item => item.name === productName);
    if (product) {
      product.quantity = quantity;
      this.cartItemCount.next(this.items.reduce((acc, item) => acc + (item.quantity || 0), 0));
    }
  }
}
