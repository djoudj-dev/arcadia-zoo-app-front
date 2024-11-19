import { Component } from '@angular/core';

/**
 * Composant gérant les liens vers les réseaux sociaux
 */
@Component({
  selector: 'app-social-links',
  standalone: true,
  template: `
    <div class="flex justify-center gap-4">
      @for (link of socialLinks; track link.url) {
      <a
        [href]="link.url"
        class="text-tertiary hover:text-primary transition-colors duration-300"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i [class]="link.icon + ' text-2xl'"></i>
      </a>
      }
    </div>
  `,
})
export class SocialLinksComponent {
  /** Liste des liens sociaux avec leurs icônes */
  socialLinks = [
    { icon: 'fab fa-facebook', url: '#' },
    { icon: 'fab fa-instagram', url: '#' },
    { icon: 'fab fa-tiktok', url: '#' },
    { icon: 'fab fa-linkedin', url: '#' },
  ];
}
