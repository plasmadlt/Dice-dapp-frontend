import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: 'input[appAmountInput]'
})
export class AmountInputDirective {
  // To need to add two zeros after the comma
  private $addZero: boolean;

  constructor(private el: ElementRef, private control: NgControl) {}

  /**
   * Check the first zero and replace, if input is number
   */
  @HostListener('keydown', ['$event']) onKeydown(event: KeyboardEvent) {
    if (this.el.nativeElement.value === '0' && /[1-9]/.test(event.key)) {
      this.el.nativeElement.value = '';
    }
  }

  /**
   * Input event handler
   */
  @HostListener('input') onInput() {
    let value: string = this.el.nativeElement.value;
    if (value) {
      // Filter invalid chars
      value = value.replace(/[^.,0-9]/gi, '');
      // Replace comma to dot
      value = value.replace(',', '.');

      // Separate integer and fractional parts
      let integer;
      let fractional;
      [integer, fractional] = value.split('.');
      integer = parseInt(integer, 10);
      integer = isNaN(integer) ? 0 : integer;

      // Connect two parts
      value = `${integer}`;
      if (fractional !== undefined) {
        value += `.${fractional}`;
      }
    } else {
      value = '0';
    }
    this.control.control.setValue(value);
  }

  /**
   * Check value after blur event
   */
  @HostListener('blur') onBlur() {
    let value = parseFloat(this.el.nativeElement.value);
    value = isNaN(value) ? 0 : value;
    this.control.control.setValue(this.$addZero ? value.toFixed(2) : value);
  }

  /**
   * Input settings
   */
  @Input() set appAmountInput(options: {addZero?: boolean}) {
    this.$addZero = !!options && options.addZero;
  }
}
