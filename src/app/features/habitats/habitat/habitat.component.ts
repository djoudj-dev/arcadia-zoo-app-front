import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { Habitat } from '../../../core/models/habitat.model'; // Import du service
import { HabitatService } from '../service/habitat.service';
import { BorderCardDirective } from '../../../shared/directives/border-card-habitat/border-card-habitat.directive';

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
  habitat: Habitat | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private habitatService: HabitatService // Utilisation du service
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.habitatService.getHabitatById(id).subscribe((data) => {
        if (data) {
          this.habitat = data;
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
