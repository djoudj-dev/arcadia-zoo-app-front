import { Component } from '@angular/core';

interface SocialLink {
  id: number;
  icon: string;
  url: string;
  name: string;
}

/**
 * Composant gérant les liens vers les réseaux sociaux
 */
@Component({
  selector: 'app-social-links',
  standalone: true,
  template: `
    <div class="flex justify-center gap-4">
      @for (link of socialLinks; track link.id) {
      <a
        [href]="link.url"
        [title]="link.name"
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
  socialLinks: SocialLink[] = [
    { id: 1, icon: 'fab fa-facebook', url: '#', name: 'Facebook' },
    { id: 2, icon: 'fab fa-instagram', url: '#', name: 'Instagram' },
    { id: 3, icon: 'fab fa-tiktok', url: '#', name: 'TikTok' },
    { id: 4, icon: 'fab fa-linkedin', url: '#', name: 'LinkedIn' },
  ];
}
