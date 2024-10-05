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
export class NavComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    // Sélectionne le bouton de basculement du menu et la liste de navigation principale
    const toggleMenuBtn = document.getElementById(
      'menu-toggler'
    ) as HTMLButtonElement;
    const mainNavlist = document.getElementById(
      'main-navlist'
    ) as HTMLDivElement;

    // Vérifie que les éléments existent avant d'ajouter les écouteurs d'événements
    if (toggleMenuBtn && mainNavlist) {
      // Ajoute un écouteur d'événement au bouton de basculement pour afficher/masquer le menu
      toggleMenuBtn.addEventListener('click', () => {
        // Bascule la classe 'hidden' sur la liste de navigation
        const isHidden = mainNavlist.classList.toggle('hidden');

        // Met à jour l'attribut aria-expanded pour l'accessibilité
        toggleMenuBtn.setAttribute('aria-expanded', (!isHidden).toString());

        // Change l'icône du bouton en fonction de l'état du menu
        const toggleMenuImg = toggleMenuBtn.querySelector('img');
        if (toggleMenuImg) {
          toggleMenuImg.src = isHidden ? 'images/menu.svg' : 'images/cross.svg';
        }
      });

      // Ajoute des écouteurs d'événements aux liens du menu pour fermer le menu après un clic
      mainNavlist.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          // Cache la liste de navigation
          mainNavlist.classList.add('hidden');

          // Met à jour l'attribut aria-expanded pour indiquer que le menu est fermé
          toggleMenuBtn.setAttribute('aria-expanded', 'false');

          // Réinitialise l'icône du bouton
          const toggleMenuImg = toggleMenuBtn.querySelector('img');
          if (toggleMenuImg) {
            toggleMenuImg.src = 'images/menu.svg';
          }
        });
      });
    }
  }
}
