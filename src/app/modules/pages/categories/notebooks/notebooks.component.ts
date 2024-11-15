import { Component, OnInit } from '@angular/core';
import { DataService } from "../../../../core/services/data/data.service";
import { GridComponent } from "../../../../shared/components/grid/grid.component";

/**
 * @description
 * Este componente maneja la visualización de la lista de notebooks y las muestra en una cuadrícula.
 *
 * @usageNotes
 * Este componente debe ser utilizado para mostrar una lista de notebooks en una vista de cuadrícula.
 *
 *
 * @example
 * <app-notebooks></app-notebooks>
 */
@Component({
  selector: 'app-notebooks',
  standalone: true,
  imports: [
    GridComponent
  ],
  templateUrl: './notebooks.component.html',
  styleUrl: './notebooks.component.css'
})
export class NotebooksComponent implements OnInit {

  /**
   * Lista de productos de notebooks.
   */
  products: any[] = [];

  /**
   * Lista de productos dividida en chunks para mostrar en la cuadrícula.
   */
  chunkedProducts: any[][] = [];

  /**
   * Variable para mostrar/ocular spinner.
   */
  loading: boolean = true;


  /**
   * Constructor del componente NotebooksComponent.
   *
   * @param productService Servicio para obtener los datos de los productos.
   */
  constructor(private productService: DataService) {}

  /**
   * Inicializa el componente y carga los productos de notebooks.
   */
  ngOnInit(): void {
    this.loading = true;
    this.productService.getProducts().subscribe((product) => {
      this.products = product.notebooks;
      this.chunkedProducts = this.chunkArray(this.products, 3);
      this.loading = false;
    },error => {
      console.error(error);
      this.loading = false;
    });
  }

  /**
   * Divide una lista de elementos en chunks de un tamaño específico.
   *
   * @param myArray Lista de elementos a dividir.
   * @param chunk_size Tamaño de cada chunk.
   * @returns Lista de chunks.
   */
  chunkArray(myArray: any[], chunk_size: number): any[][] {
    let results = [];
    while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
    }
    return results;
  }
}
