import { Component, OnInit } from '@angular/core';
import { GridComponent } from "../../../../shared/components/grid/grid.component";
import { DataService } from "../../../../core/services/data/data.service";


@Component({
  selector: 'app-coffee-makers',
  standalone: true,
  imports: [
    GridComponent
  ],
  templateUrl: './coffee-makers.component.html',
  styleUrl: './coffee-makers.component.css'
})
export class CoffeeMakersComponent implements OnInit {


  products: any[] = [];
  chunkedProducts: any[][] = [];


  loading: boolean = true;
  constructor(private productService: DataService) {}


  ngOnInit(): void {
    this.loading = true;
    this.productService.getProducts().subscribe((product) => {
      this.products = product.coffeeMakers;
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
