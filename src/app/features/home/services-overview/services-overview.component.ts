import {
  AfterViewInit,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Service } from '../../../core/models/service.model';
import { SERVICES } from '../../../reviews/mocks/services-mock.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-services-overview',
  standalone: true,
  imports: [ButtonComponent, RouterLink],
  templateUrl: './services-overview.component.html',
})
export class ServicesOverviewComponent implements AfterViewInit {
  @ViewChildren('service') serviceElements!: QueryList<ElementRef>;

  services: Service[] = SERVICES;

  ngAfterViewInit() {
    this.serviceElements.forEach((element) => {
      this.addTouchListeners(element);
    });
  }

  addTouchListeners(element: ElementRef) {
    const el = element.nativeElement;
    el.addEventListener('touchstart', () => {
      const overlay = el.querySelector('.overlay');
      if (overlay) {
        overlay.classList.add('opacity-100');
      }
    });
    el.addEventListener('touchend', () => {
      const overlay = el.querySelector('.overlay');
      if (overlay) {
        overlay.classList.remove('opacity-100');
      }
    });
  }
}
