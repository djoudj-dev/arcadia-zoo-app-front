import { Component, ElementRef, ViewChild } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-services-overview',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './services-overview.component.html',
})
export class ServicesOverviewComponent {
  @ViewChild('service1', { static: true }) service1!: ElementRef;
  @ViewChild('service2', { static: true }) service2!: ElementRef;
  @ViewChild('service3', { static: true }) service3!: ElementRef;

  ngAfterViewInit() {
    this.addTouchListeners(this.service1);
    this.addTouchListeners(this.service2);
    this.addTouchListeners(this.service3);
  }

  addTouchListeners(element: ElementRef) {
    const el = element.nativeElement;
    el.addEventListener('touchstart', () => {
      el.querySelector('.overlay').classList.add('opacity-100');
    });
    el.addEventListener('touchend', () => {
      el.querySelector('.overlay').classList.remove('opacity-100');
    });
  }
}
