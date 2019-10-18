import { Component, ElementRef, forwardRef, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderComponent),
      multi: true
    }
  ],
  exportAs: 'appSlider'
})
export class SliderComponent implements ControlValueAccessor, OnInit {

  @Input() min: number;

  @Input() max: number;

  @HostBinding('class.disabled')
  @Input() disabled: boolean;

  @HostBinding('class.active')
  active: boolean;

  @HostBinding('class.move')
  move: boolean;
  // Value change function
  valueChange: Function;

  touched: Function;

  value: number;

  rollWin: number;

  constructor(private el: ElementRef) {
    this.min = 0;
    this.max = 100;
    this.disabled = false;
  }

  /**
   * Component init handler
   */
  ngOnInit(): void {

  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void {
    event.stopPropagation();

    if (!this.disabled) {
      this.active = true;
      this.value = this.getOffset(event);
      this.valueChange(Math.round(this.value));
      this.touched();
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    if (this.active && !this.disabled) {
      this.move = true;
      this.value = this.getOffset(event);
      this.valueChange(Math.round(this.value));
    }
  }

  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event): void {
    event.stopPropagation();
    this.active = false;
    this.move = false;
  }

  /**
   * Set value
   */
  writeValue(value: number): void {
    this.value = value > 100 ? 100 : value < 0 ? 0 : value;

    if (value !== this.value) {
      this.valueChange(this.value);
    }
  }

  /**
   * Is disabled setter
   */
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  /**
   * Register onchange function
   */
  registerOnChange(fn: Function): void {
    this.valueChange = fn;
  }

  /**
   * Register on touch function
   */
  registerOnTouched(fn: Function): void {
    this.touched = fn;
  }

  /**
   * Set win roll
   */
  win(rollWin: number): void {
    this.rollWin = rollWin;
  }

  /**
   * Returns slider value in percent
   */
  private getOffset(event: MouseEvent): number {
    const element = <HTMLElement>this.el.nativeElement;
    const slider: HTMLDivElement = <HTMLDivElement>element.getElementsByClassName('slider-wrapper')[0];
    const rect: ClientRect = slider.getBoundingClientRect();
    const mouseLeft = event.pageX - rect.left;
    const percent = mouseLeft / (rect.width / 100);

    return percent > this.max ? this.max : percent < this.min ? this.min : percent;
  }
}
