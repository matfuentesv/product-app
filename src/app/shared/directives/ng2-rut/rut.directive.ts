import {Directive, EventEmitter, HostListener, Output} from '@angular/core';
import * as rutHelpers from 'rut-helpers';

@Directive({
  selector: '[appFormatRut]'
})
export class RutDirective {
  @Output() public rutChange: EventEmitter<any>;

  constructor() {
    this.rutChange = new EventEmitter();
  }

  @HostListener('focus', ['$event'])
  public onFocus(ev: Event): void {
    const htmlInputElement: HTMLInputElement = ev.target as HTMLInputElement;
    htmlInputElement.value = rutHelpers.rutClean(htmlInputElement.value);
  }

  @HostListener('blur', ['$event'])
  public onBlur(ev: Event): void {
    const htmlInputElement: HTMLInputElement = ev.target as HTMLInputElement;
    htmlInputElement.value = rutHelpers.rutFormat(htmlInputElement.value) || '';
  }

  @HostListener('input', ['$event'])
  public onChange(ev: Event): void {
    const htmlInputElement: HTMLInputElement = ev.target as HTMLInputElement;
    this.rutChange.emit(rutHelpers.rutClean(htmlInputElement.value));
  }
}
