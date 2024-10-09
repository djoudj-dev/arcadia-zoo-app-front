import { Component } from '@angular/core';
import { Habitat } from '../../core/models/habitat.model';

@Component({
  selector: 'app-habitat',
  standalone: true,
  imports: [],
  templateUrl: './habitat.component.html',
  styleUrl: './habitat.component.css',
})
export class HabitatComponent {
  habitat: Habitat | undefined;
}
