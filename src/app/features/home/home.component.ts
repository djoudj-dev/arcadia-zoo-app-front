import { Component } from '@angular/core';
import { ZooIntroComponent } from './zoo-intro/zoo-intro.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ZooIntroComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
