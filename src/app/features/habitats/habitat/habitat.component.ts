import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Habitat } from '../../../core/models/habitat.model';
import { HabitatService } from '../service/habitat.service';
import { BorderCardDirective } from '../../../shared/directives/border-card-habitat/border-card-habitat.directive';
import { environment } from '../../../../environments/environment.development';

@Component({
  selector: 'app-habitat',
  standalone: true,
  imports: [RouterLink, ButtonComponent, BorderCardDirective],
  templateUrl: './habitat.component.html',
  styles: [
    `
      span {
        font-weight: bold;
        color: #0e1805;
      }
    `,
  ],
})
export class HabitatComponent implements OnInit {
  habitat = signal<Habitat | undefined>(undefined);
  imageBaseUrl = `${environment.apiUrl}/uploads/img-habitats`;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private habitatService: HabitatService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.habitatService.getHabitatById(id).subscribe((data) => {
        if (data) {
          // Vérifie si l'image contient déjà l'URL de base
          data.image = data.image?.startsWith('http')
            ? data.image
            : `${environment.apiUrl}/uploads/img-habitats/${data.image}`;

          this.habitat.set(data);
          console.log('Habitat trouvé :', this.habitat);
        } else {
          console.error('Habitat non trouvé');
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
