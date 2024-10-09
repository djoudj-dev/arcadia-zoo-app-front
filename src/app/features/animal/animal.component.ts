import { Component, OnInit } from '@angular/core';
import { Animal } from '../../core/models/animal.model';
import { ANIMALS } from '../../reviews/mocks/animals-mock.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NavComponent } from '../../shared/components/header/navbar/nav.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-animal',
  standalone: true,
  imports: [RouterLink, NavComponent, FooterComponent],
  templateUrl: './animal.component.html',
  styleUrls: ['./animal.component.css'],
})
export class AnimalComponent implements OnInit {
  animal: Animal | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Route param ID:', id);

    this.animal = ANIMALS.find((animal) => animal.id === Number(id));
  }
}
