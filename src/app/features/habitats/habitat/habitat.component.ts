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
    console.log('Route param ID:', id);

    // Utiliser le service pour récupérer un habitat par ID
    this.habitatService.getHabitatById(id).subscribe((data) => {
      this.habitat = data;
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
