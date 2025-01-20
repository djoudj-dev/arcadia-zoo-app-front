import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AnimalService } from 'app/features/animal/service/animal.service';
import { HabitatService } from 'app/features/habitats/service/habitat.service';
import { ServiceService } from 'app/features/zoo-services/service/service.service';
import { environment } from 'environments/environment';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { Animal } from '../../animal-management/model/animal.model';
import { Habitat } from '../../habitat-management/model/habitat.model';
import { Service } from '../../service-management/model/service.model';
import { VisitStats } from './interfaces/visit-stats.interface';
import { VisitTrackingService } from './services/visit-tracking.service';

interface ChartData {
  name: string;
  value: number;
  extra: {
    image: string;
    type: string;
  };
}

@Component({
  selector: 'app-visit-stats',
  standalone: true,
  imports: [CommonModule, NgxChartsModule, ButtonComponent],
  template: `
    <div class="bg-white p-6 rounded-lg shadow-md">
      <!-- En-tête simple -->
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-tertiary">
          Statistiques des visites
        </h2>
        <div class="flex gap-2">
          @for(type of ['all', 'animal', 'habitat', 'service']; track type) {
          <button
            (click)="setFilter(type)"
            [class.bg-tertiary]="currentFilter() === type"
            [class.text-white]="currentFilter() === type"
            class="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-tertiary/10"
          >
            {{ type === 'all' ? 'Tous' : type }}
          </button>
          }
        </div>
      </div>

      <!-- Graphique -->
      <div
        class="flex justify-center items-center bg-white rounded-lg mb-6 w-full overflow-x-auto"
      >
        <div class="min-w-[1100px]">
          <ngx-charts-bar-vertical
            [view]="[1100, 400]"
            [results]="chartData()"
            [xAxis]="true"
            [yAxis]="true"
            [showXAxisLabel]="false"
            [showYAxisLabel]="true"
            [customColors]="customColors"
            [noBarWhenZero]="true"
            [barPadding]="35"
            [roundEdges]="true"
            [animations]="true"
            [showDataLabel]="true"
          >
          </ngx-charts-bar-vertical>
        </div>
      </div>

      <!-- Grille d'images -->
      <div
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mt-8"
      >
        @for(item of filteredData(); track item.name) {
        <div
          class="flex flex-col items-center space-y-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <div class="relative w-20 h-20">
            <img
              [src]="item.extra.image"
              [alt]="item.name"
              class="w-full h-full object-cover rounded-lg shadow-sm"
            />
          </div>
          <span class="text-sm font-medium text-gray-700 text-center">{{
            item.name
          }}</span>
          <span class="text-xs text-gray-500">{{ item.value }} visites</span>
        </div>
        }
      </div>

      <!-- Bouton d'export -->
      <div class="mt-6 flex justify-end">
        <app-button
          [text]="'Exporter les données'"
          [type]="'button'"
          [color]="'tertiary'"
          [rounded]="true"
          class="px-2 shadow-sm hover:shadow-md transition-all duration-200"
          (click)="exportData()"
          (keydown)="exportData()"
        ></app-button>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }

      ::ng-deep {
        .ngx-charts {
          .grid-line-path {
            stroke: #e5e7eb;
            stroke-width: 0.5;
          }

          .tick text {
            font-size: 12px;
            fill: #6b7280;
          }
        }
      }
    `,
  ],
})
export class VisitStatsComponent {
  private readonly trackingService = inject(VisitTrackingService);
  private readonly animalService = inject(AnimalService);
  private readonly habitatService = inject(HabitatService);
  private readonly serviceService = inject(ServiceService);

  // Configuration du graphique
  readonly customColors = [
    { name: 'Animaux', value: '#557A46' },
    { name: 'Habitats', value: '#7A9D54' },
    { name: 'Services', value: '#A4D0A4' },
  ];
  readonly colorScheme: string = 'forest';

  // Signals
  private readonly animals = signal<Animal[]>([]);
  private readonly habitats = signal<Habitat[]>([]);
  private readonly services = signal<Service[]>([]);
  readonly stats = signal<VisitStats[]>([]);
  readonly currentFilter = signal<string>('all');
  readonly visitData = signal<ChartData[]>([]);

  // Computed values
  readonly categoryTypes = computed(() => [
    'all',
    ...new Set(this.stats().map((s) => s.category_type)),
  ]);

  readonly filteredData = computed(() => {
    const allData = this.visitData();
    return this.currentFilter() === 'all'
      ? allData
      : allData.filter((item) => item.extra.type === this.currentFilter());
  });

  readonly chartData = computed(() => {
    const data = this.filteredData();
    return data;
  });

  constructor() {
    this.initializeSubscriptions();
  }

  ngOnInit() {
    this.loadEntities();
    setTimeout(() => this.loadVisitStats(), 1000);
  }

  private initializeSubscriptions() {
    this.trackingService.visitStats$.subscribe((stats) =>
      this.stats.set(stats)
    );
    this.trackingService.refreshStats();
  }

  private loadEntities(): void {
    this.loadAnimals();
    this.loadHabitats();
    this.loadServices();
  }

  private loadAnimals(): void {
    this.animalService.getAnimals().subscribe((animals: Animal[]) => {
      this.animals.set(animals);
    });
  }

  private loadHabitats(): void {
    this.habitatService.getHabitats().subscribe((habitats: Habitat[]) => {
      this.habitats.set(habitats);
    });
  }

  private loadServices(): void {
    this.serviceService.getServices().subscribe((services: Service[]) => {
      this.services.set(services);
    });
  }

  private loadVisitStats(): void {
    this.trackingService.visitStats$.subscribe({
      next: (stats: VisitStats[]) => {
        const formattedData = stats.map((item) => ({
          name: item.category_name,
          value: item.visit_count || 0,
          extra: {
            image: this.getImageUrl(item.category_type, item.category_name),
            type: item.category_type,
          },
        }));
        this.visitData.set(formattedData);
      },
      error: (error: Error) =>
        console.error('Erreur lors du chargement des statistiques:', error),
    });

    // Forcer un rafraîchissement initial des stats
    this.trackingService.refreshStats();
  }

  private getImageUrl(type: string, name: string): string {
    const baseUrl = `${environment.apiUrl}/api/uploads`;

    switch (type) {
      case 'animal':
        return this.getAnimalImage(name, baseUrl);
      case 'habitat':
        return this.getHabitatImage(name, baseUrl);
      case 'service':
        return this.getServiceImage(name, baseUrl);
      default:
        return `${baseUrl}/default.webp`;
    }
  }

  private getAnimalImage(name: string, baseUrl: string): string {
    const animal = this.animals().find((a) => a.name === name);
    return animal?.images
      ? `${baseUrl}/animals/${animal.images.split('/').pop()}`
      : `${baseUrl}/animals/default.webp`;
  }

  private getHabitatImage(name: string, baseUrl: string): string {
    const habitat = this.habitats().find((h) => h.name === name);
    return habitat?.images
      ? `${baseUrl}/habitats/${habitat.images.split('/').pop()}`
      : `${baseUrl}/habitats/default.webp`;
  }

  private getServiceImage(name: string, baseUrl: string): string {
    const service = this.services().find((s) => s.name === name);
    return service?.images
      ? `${baseUrl}/services/${service.images.split('/').pop()}`
      : `${baseUrl}/services/default.webp`;
  }

  setFilter(type: string) {
    this.currentFilter.set(type);
  }

  exportData() {
    const data = this.stats();
    const csv = this.convertToCSV(data);
    this.downloadCSV(csv);
  }

  private convertToCSV(data: VisitStats[]): string {
    const headers = ['Catégorie', 'Type', 'Nombre de visites', 'Pourcentage'];
    const rows = data.map((stat) => [
      stat.category_name,
      stat.category_type,
      stat.visit_count,
      stat.visit_percentage,
    ]);
    return [headers, ...rows].map((row) => row.join(',')).join('\n');
  }

  private downloadCSV(csv: string): void {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'statistiques-visites.csv';
    a.click();
  }
}
