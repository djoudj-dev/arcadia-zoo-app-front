import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appBorderCardAnimal]',
  standalone: true,
})
export class BorderCardAnimalDirective {
  private initialColor: string = '#ffffff';
  private defaultColor: string = '#557a46';

  constructor(private el: ElementRef) {
    this.setBorder(this.initialColor);
  }

  @Input('appBorderAnimalCard') borderColor: string = '';

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
