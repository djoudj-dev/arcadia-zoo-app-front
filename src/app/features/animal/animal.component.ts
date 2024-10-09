import { Component, OnInit } from '@angular/core';
import { Animal } from '../../core/models/animal.model';
import { ANIMALS } from '../../reviews/mocks/animals-mock.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NavComponent } from '../../shared/components/header/navbar/nav.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-animal',
  standalone: true,
  imports: [RouterLink, NavComponent, FooterComponent, ButtonComponent],
  templateUrl: './animal.component.html',
  styles: [
    `
      span {
        font-weight: bold;
        color: #0e1805;
      }
    `,
  ],
})
export class AnimalComponent implements OnInit {
  animal: Animal | undefined;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Route param ID:', id);

    this.animal = ANIMALS.find((animal) => animal.id === Number(id));
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
