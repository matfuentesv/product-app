import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customCurrency',
  standalone: true
})
export class CustomCurrencyPipe implements PipeTransform {

  transform(value: number | string): string | null {
    if (value === null || value === undefined) {
      return null;
    }
    const numericValue = parseFloat(value.toString());

    if (isNaN(numericValue)) {
      return null;
    }
    let formattedValue = numericValue.toFixed(2);
    formattedValue = formattedValue.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    formattedValue = formattedValue.replace(/,00$/, '');
    return `$${formattedValue}`;
  }
}
