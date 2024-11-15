import {Directive, ElementRef, forwardRef, HostListener, Renderer2} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {rutFormat} from 'rut-helpers';

const RUT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => RutValueAccessorDirective),
  multi: true,
};

@Directive({
  selector: 'input[appFormatRut]',
  providers: [RUT_VALUE_ACCESSOR],
})
export class RutValueAccessorDirective implements ControlValueAccessor {
  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
  ) {
  }

  @HostListener('rutChange', ['$event'])
  public onChange: any = (_: any) => {
  }

  @HostListener('blur', ['$event'])

  public onTouched: any = () => {
  }

  public writeValue(value: any): void {
    const normalizedValue: string = rutFormat(value) || '';
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', normalizedValue);
  }

  public registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}
