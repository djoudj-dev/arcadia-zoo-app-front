import { AfterViewInit, Component } from '@angular/core';
import { BannerComponent } from '../banner/banner.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [BannerComponent, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  isNavOpen = false; // Utilisé pour gérer l'état du menu

  // Méthode pour basculer l'état du menu
  toggleNav(): void {
    this.isNavOpen = !this.isNavOpen;
  }
}
