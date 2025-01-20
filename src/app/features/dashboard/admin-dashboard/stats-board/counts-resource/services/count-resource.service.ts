import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from 'environments/environment';
import { catchError, Observable, tap, throwError } from 'rxjs';

/** Interface pour les statistiques */
interface Stats {
  animals: number;
  habitats: number;
  services: number;
  employe: number;
  vet: number;
}

/**
 * Service de gestion des statistiques des ressources
 * Gère le comptage et la mise à jour des différentes ressources du zoo
 */
@Injectable({
  providedIn: 'root',
})
export class CountResourceService {
  /** URL de base pour les endpoints des statistiques */
  private readonly apiUrl = `${environment.apiUrl}/api/stats/count-resource`;

  /** Signaux pour la gestion d'état réactive */
  totalAnimals = signal<number>(0);
  totalHabitats = signal<number>(0);
  totalServices = signal<number>(0);
  totalEmploye = signal<number>(0);
  totalVet = signal<number>(0);

  constructor(private readonly http: HttpClient) {}

  /**
   * Récupère les statistiques depuis l'API
   * Met à jour les signaux avec les nouvelles valeurs
   * @returns Observable<Stats> Statistiques des ressources
   */
  getStats(): Observable<Stats> {
    return this.http.get<Stats>(this.apiUrl).pipe(
      tap((stats: Stats) => {
        this.updateStats(stats);
      }),
      catchError(this.handleError)
    );
  }

  /** Méthodes d'incrémentation des compteurs */

  /** Incrémente le nombre total d'animaux */
  incrementTotalAnimals(): void {
    this.totalAnimals.update((value) => value + 1);
  }

  /** Décrémente le nombre total d'animaux */
  decrementTotalAnimals(): void {
    this.totalAnimals.update((value) => Math.max(0, value - 1));
  }

  /** Incrémente le nombre total d'habitats */
  incrementTotalHabitats(): void {
    this.totalHabitats.update((value) => value + 1);
  }

  /** Décrémente le nombre total d'habitats */
  decrementTotalHabitats(): void {
    this.totalHabitats.update((value) => Math.max(0, value - 1));
  }

  /** Incrémente le nombre total de services */
  incrementTotalServices(): void {
    this.totalServices.update((value) => value + 1);
  }

  /** Décrémente le nombre total de services */
  decrementTotalServices(): void {
    this.totalServices.update((value) => Math.max(0, value - 1));
  }

  /** Incrémente le nombre total d'employés */
  incrementTotalEmploye(): void {
    this.totalEmploye.update((value) => value + 1);
  }

  /** Décrémente le nombre total d'employés */
  decrementTotalEmploye(): void {
    this.totalEmploye.update((value) => Math.max(0, value - 1));
  }

  /** Incrémente le nombre total de vétérinaires */
  incrementTotalVet(): void {
    this.totalVet.update((value) => value + 1);
  }

  /** Décrémente le nombre total de vétérinaires */
  decrementTotalVet(): void {
    this.totalVet.update((value) => Math.max(0, value - 1));
  }

  /**
   * Met à jour tous les signaux avec les nouvelles statistiques
   * @param stats Nouvelles statistiques à appliquer
   */
  private updateStats(stats: Stats): void {
    this.totalAnimals.set(stats.animals);
    this.totalHabitats.set(stats.habitats);
    this.totalServices.set(stats.services);
    this.totalEmploye.set(stats.employe);
    this.totalVet.set(stats.vet);
  }

  /**
   * Gestion centralisée des erreurs HTTP
   * @param error Erreur HTTP reçue
   * @returns Observable<never> Observable d'erreur formatée
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return throwError(
      () => new Error('Erreur lors de la récupération des statistiques')
    );
  }
}
