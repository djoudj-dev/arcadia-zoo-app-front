import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, map, Subject, switchMap, takeUntil } from 'rxjs';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { AnimalService } from '../../../animal/service/animal.service';
import { Habitat } from '../../../habitats/models/habitat.model';
import { HabitatService } from '../../../habitats/service/habitat.service';
import { Animal } from '../../admin-dashboard/animal-management/model/animal.model';

@Component({
  selector: 'app-animal-feeding-management',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './animal-feeding-management.component.html',
})
export class AnimalFeedingManagementComponent implements OnInit, OnDestroy {
  // Signaux publics
  public readonly habitats = signal<Habitat[]>([]);
  public readonly animals = signal<Animal[]>([]);
  public readonly isLoading = signal<boolean>(false);
  public readonly error = signal<string | null>(null);

  // Subject pour la gestion de la destruction
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly habitatService: HabitatService,
    private readonly animalService: AnimalService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadHabitats();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public markAsFed(animalId: number): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.animalService
      .markAnimalAsFed(animalId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.habitatService.clearCache();
          this.loadHabitats(); // Recharger les données
        },
        error: (error) => {
          this.isLoading.set(false);
          this.error.set("Erreur lors du marquage de l'animal comme nourri");
          console.error(
            "Erreur lors du marquage de l'animal comme nourri:",
            error
          );
        },
      });
  }

  private loadHabitats(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.habitatService
      .getHabitats()
      .pipe(
        switchMap((habitats) =>
          forkJoin(
            habitats.map((habitat) =>
              this.habitatService
                .getAnimalsByHabitatId(habitat.id_habitat)
                .pipe(
                  map((animals) => ({
                    ...habitat,
                    animals,
                  }))
                )
            )
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (habitatsWithAnimals) => {
          this.habitats.set(habitatsWithAnimals);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.error.set('Erreur lors du chargement des habitats');
          this.isLoading.set(false);
          console.error('Erreur lors du chargement des habitats:', error);
        },
      });
  }
  goBack() {
    this.router.navigate(['/']);
  }
}
