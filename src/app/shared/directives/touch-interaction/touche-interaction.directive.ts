import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appTouchInteraction]',
})
export class TouchInteractionDirective {
  constructor(private el: ElementRef) {}

  @HostListener('touchstart') onTouchStart() {
    const overlay = this.el.nativeElement.querySelector('.overlay');
    if (overlay) {
      overlay.classList.add('opacity-100');
    }
  }

  @HostListener('touchend') onTouchEnd() {
    const overlay = this.el.nativeElement.querySelector('.overlay');
    if (overlay) {
      overlay.classList.remove('opacity-100');
    }
  }
}
