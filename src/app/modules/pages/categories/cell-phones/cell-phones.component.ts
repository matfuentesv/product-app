import { Component, OnInit } from '@angular/core';
import { DataService } from "../../../../core/services/data/data.service";
import { GridComponent } from "../../../../shared/components/grid/grid.component";


@Component({
  selector: 'app-cell-phones',
  standalone: true,
  imports: [GridComponent],
  templateUrl: './cell-phones.component.html',
  styleUrl: './cell-phones.component.css'
})
export class CellPhonesComponent implements OnInit {


  products: any[] = [];
  chunkedProducts: any[][] = [];
  loading: boolean = true;



  constructor(private productService: DataService) {}


  ngOnInit(): void {
    this.loading = true;
    this.productService.getProducts().subscribe((product) => {
      this.products = product.cellPhones;
      this.chunkedProducts = this.chunkArray(this.products, 3);
      this.loading = false;
    },error => {
      console.error(error);
      this.loading = false;
    });
  }


  chunkArray(myArray: any[], chunk_size: number): any[][] {
    let results = [];
    while (myArray.length) {
      results.push(myArray.splice(0, chunk_size));
    }
    return results;
  }
}
