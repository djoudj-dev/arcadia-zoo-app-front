import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  openModal() {
    const modal = document.getElementById('modal');
    modal?.classList.remove('hidden');
  }

  closeModal() {
    const modal = document.getElementById('modal');
    modal?.classList.add('hidden');
  }
}
