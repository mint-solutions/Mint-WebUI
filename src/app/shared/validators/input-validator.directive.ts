import { Directive, Input, OnInit, ElementRef, HostListener } from '@angular/core';
import { NumericValidator, AllowedKeys, AllowedCurrencyKeys } from './digitValidators';

@Directive({
  selector: '[appInputValidator]'
})
export class InputValidatorDirective implements OnInit {
  @Input('appInputValidator') selectInput = '';

  input: HTMLInputElement;

  constructor(el: ElementRef) {
    this.input = el.nativeElement;
  }

  ngOnInit() {}

  @HostListener('keydown', ['$event', '$event.keyCode'])
  onKeyDown($event: KeyboardEvent, keyCode: any) {
    const key = $event.key;
    const valid = NumericValidator(key);
    const allowedKey = AllowedKeys(keyCode);
    const allowedCurrencyKey = AllowedCurrencyKeys(keyCode);
    //console.log(keyCode);
    if (this.selectInput === 'number') {
      if (!valid && !allowedKey) {
        $event.preventDefault();
      }
    }

    if (this.selectInput === 'currency') {
      if (!valid && !allowedCurrencyKey) {
        $event.preventDefault();
      }
    }
  }
}
