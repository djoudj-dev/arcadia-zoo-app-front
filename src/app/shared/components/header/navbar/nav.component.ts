import { AfterViewInit, Component } from '@angular/core';
import { SubnavComponent } from '../subnav/subnav.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [SubnavComponent],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements AfterViewInit {
  // Implémentation de AfterViewInit pour s'assurer que le DOM est chargé
  ngAfterViewInit(): void {
    const toggleMenuBtn =
      document.querySelector<HTMLButtonElement>('#menu-toggler');
    const toggleMenuImg =
      document.querySelector<HTMLImageElement>('#menu-toggler img');
    const mainNavlist = document.querySelector<HTMLDivElement>('#main-navlist');
    const menuLinks =
      document.querySelectorAll<HTMLAnchorElement>('#main-navlist a');

    // Vérification que les éléments existent avant de les utiliser
    if (toggleMenuBtn && toggleMenuImg && mainNavlist) {
      [toggleMenuBtn, ...Array.from(menuLinks)].forEach((element) => {
        element.addEventListener(
          'click',
          this.toggleNav.bind(this, toggleMenuImg, mainNavlist, toggleMenuBtn)
        );
      });
    }
  }

  // Méthode pour gérer l'affichage/masquage du menu
  toggleNav(
    toggleMenuImg: HTMLImageElement,
    mainNavlist: HTMLDivElement,
    toggleMenuBtn: HTMLButtonElement
  ): void {
    if (mainNavlist.classList.contains('hidden')) {
      mainNavlist.classList.remove('hidden');
      toggleMenuImg.setAttribute('src', 'images/cross.svg');
      toggleMenuBtn.setAttribute('aria-expanded', 'true');
    } else {
      mainNavlist.classList.add('hidden');
      toggleMenuImg.setAttribute('src', 'images/menu.svg');
      toggleMenuBtn.setAttribute('aria-expanded', 'false');
    }
  }
}
