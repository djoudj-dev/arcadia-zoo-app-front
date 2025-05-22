import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Animal } from 'app/features/dashboard/admin-dashboard/animal-management/model/animal.model';
import { environment } from 'environments/environment';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EnhancedAnimalService {
  private readonly apiUrl = `${environment.apiUrl}/api/animals`;
  private readonly imageBaseUrl = `${environment.apiUrl}/api`;

  // Signaux pour l'état
  private readonly animalsSignal = signal<Animal[]>([]);
  private readonly isLoadingSignal = signal<boolean>(false);

  // Computed values
  readonly animals = computed(() => this.animalsSignal());
  readonly loading = computed(() => this.isLoadingSignal());

  constructor(private readonly http: HttpClient) {
    // Chargement initial
    this.fetchAnimals().subscribe();
  }

  refreshAnimals(): void {
    this.fetchAnimals().subscribe();
  }

  private fetchAnimals(): Observable<Animal[]> {
    this.isLoadingSignal.set(true);

    return this.http.get<Animal[]>(this.apiUrl).pipe(
      map((animals) => this.formatAnimalImages(animals)),
      tap((animals) => {
        this.animalsSignal.set(animals);
        this.isLoadingSignal.set(false);
      }),
      catchError((error) => {
        console.error('Erreur lors du chargement des animaux:', error);
        this.isLoadingSignal.set(false);
        return of([]);
      })
    );
  }

  updateAnimal(animalId: number, formData: FormData): Observable<Animal> {
    return this.http.put<Animal>(`${this.apiUrl}/${animalId}`, formData).pipe(
      map((animal) => ({
        ...animal,
        images: this.formatImageUrl(animal.images),
      })),
      tap((updatedAnimal) => {
        // Mise à jour optimisée du signal
        this.animalsSignal.update((animals) =>
          animals.map((a) => (a.id_animal === animalId ? updatedAnimal : a))
        );
      }),
      catchError((error) => {
        console.error('Erreur lors de la mise à jour:', error);
        throw error;
      })
    );
  }

  // Méthodes utilitaires existantes
  private formatAnimalImages(animals: Animal[]): Animal[] {
    return animals.map((animal) => ({
      ...animal,
      images: this.formatImageUrl(animal.images),
    }));
  }

  /**
   * Formate l'URL de l'image pour un animal
   * @param imagePath - Chemin de l'image
   * @returns string - URL complète de l'image
   */
  private formatImageUrl(imagePath: string | null): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;

    // Si le chemin contient déjà "uploads", on extrait juste le nom du fichier
    if (imagePath.includes('uploads')) {
      const parts = imagePath.split('/');
      imagePath = parts[parts.length - 1];
    }

    return `${this.imageBaseUrl}/uploads/animals/${imagePath}`;
  }
}
