import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Animal } from 'app/features/dashboard/admin-dashboard/animal-management/model/animal.model';
import { environment } from 'environments/environment.development';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { catchError, finalize, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EnhancedAnimalService {
  private readonly apiUrl = `${environment.apiUrl}/api/animals`;
  private readonly imageBaseUrl = `${environment.apiUrl}/api`;

  private readonly animalsCache = new BehaviorSubject<Animal[]>([]);
  private readonly refreshAnimalList$ = new Subject<boolean>();
  private readonly isLoading = new BehaviorSubject<boolean>(false);

  constructor(private readonly http: HttpClient) {
    // Initialiser le système de rafraîchissement automatique
    this.refreshAnimalList$
      .pipe(switchMap(() => this.fetchAnimals()))
      .subscribe();
  }

  get animals$(): Observable<Animal[]> {
    return this.animalsCache.asObservable();
  }

  get loading$(): Observable<boolean> {
    return this.isLoading.asObservable();
  }

  refreshAnimals(): void {
    this.refreshAnimalList$.next(true);
  }

  private fetchAnimals(): Observable<Animal[]> {
    this.isLoading.next(true);

    return this.http.get<Animal[]>(this.apiUrl).pipe(
      map((animals) => this.formatAnimalImages(animals)),
      tap((animals) => this.animalsCache.next(animals)),
      finalize(() => this.isLoading.next(false)),
      catchError((error) => {
        console.error('Erreur lors du chargement des animaux:', error);
        return of([]);
      })
    );
  }

  private formatAnimalImages(animals: Animal[]): Animal[] {
    return animals.map((animal) => ({
      ...animal,
      images: this.formatImageUrl(animal.images),
    }));
  }

  private formatImageUrl(imagePath: string | null): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${this.imageBaseUrl}/${imagePath.replace(/^\/+/, '')}`;
  }

  updateAnimal(animalId: number, formData: FormData): Observable<Animal> {
    return this.http.put<Animal>(`${this.apiUrl}/${animalId}`, formData).pipe(
      map((animal) => ({
        ...animal,
        images: this.formatImageUrl(animal.images),
      })),
      tap(() => this.refreshAnimals()),
      catchError((error) => {
        console.error('Erreur lors de la mise à jour:', error);
        throw error;
      })
    );
  }
}
