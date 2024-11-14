import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment.development';
import { BorderCardDirective } from '../../../shared/directives/border-card-habitat/border-card-habitat.directive';
import { Habitat } from '../../dashboard/admin-dashboard/habitat-management/model/habitat.model';
import { HabitatService } from '../../habitats/service/habitat.service';

@Component({
  selector: 'app-habitats-overview',
  standalone: true,
  imports: [BorderCardDirective, RouterLink],
  templateUrl: './habitats-overview.component.html',
})
export class HabitatsOverviewComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  habitats = signal<Habitat[]>([]);

  constructor(private habitatService: HabitatService) {}

  ngOnInit() {
    this.loadHabitats();
  }

  private loadHabitats(): void {
    this.habitatService
      .getHabitats()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.habitats.set(data.map(this.formatHabitatImage));
      });
  }

  private formatHabitatImage(habitat: Habitat): Habitat {
    return {
      ...habitat,
      images: habitat.images.startsWith('http')
        ? habitat.images
        : `${environment.apiUrl}/uploads/${habitat.images}`,
    };
  }
}
