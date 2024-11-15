import {Directive, forwardRef} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors} from '@angular/forms';
import {rutValidate} from 'rut-helpers';


@Directive({
  selector: '[appValidateRut][ngModel],[appValidateRut][formControl]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => RutValidatorDirective), multi: true},
  ],
})
export class RutValidatorDirective {
  static validate(c: AbstractControl): ValidationErrors | null {
    return rutValidate(c.value) ? null : {invalidRut: true};
  }
}
