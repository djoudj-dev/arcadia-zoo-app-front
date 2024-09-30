import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appBorderCard]',
  standalone: true,
})
export class BorderCardDirective {
  private initialColor: string = '#557a46';
  private defaultColor: string = '#ffffff';

  constructor(private el: ElementRef) {
    this.setBorder(this.initialColor);
  }

  @Input('appBorderCard') borderColor: string = '';

  @HostListener('mouseenter') onMouseEnter() {
    this.setBorder(this.borderColor || this.defaultColor);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.setBorder(this.initialColor);
  }

  setBorder(color: string) {
    this.el.nativeElement.style.border = `solid 1px ${color}`;
  }
}
