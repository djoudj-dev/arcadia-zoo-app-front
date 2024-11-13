// src/app/admin-dashboard/stats/stats.component.ts
import { Component, OnInit } from '@angular/core';
import { CountResourceService } from './services/count-resource.service';

@Component({
  standalone: true,
  selector: 'app-count-resource',
  templateUrl: './count-resource.component.html',
})
export class CountResourceComponent implements OnInit {
  constructor(public countResourceService: CountResourceService) {}

  ngOnInit() {
    this.loadCountResource();
  }

  loadCountResource() {
    this.countResourceService.getStats().subscribe({
      next: () => {
        console.log(
          'Statistiques mises à jour:',
          this.countResourceService.totalAnimals(),
          this.countResourceService.totalHabitats(),
          this.countResourceService.totalServices(),
          this.countResourceService.totalEmploye(),
          this.countResourceService.totalVet()
        );
      },
      error: (error) => {
        console.error(
          'Erreur lors de la récupération des statistiques:',
          error
        );
      },
    });
  }
}
