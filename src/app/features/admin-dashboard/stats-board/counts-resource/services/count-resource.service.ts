import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from 'environments/environment.development';
import { catchError, Observable, tap, throwError } from 'rxjs';

interface Stats {
  animals: number;
  habitats: number;
  services: number;
  employe: number;
  vet: number;
}

@Injectable({
  providedIn: 'root',
})
export class CountResourceService {
  private apiUrl = `${environment.apiUrl}/api/stats/count-resource`;

  // Signaux pour chaque statistique
  totalAnimals = signal<number>(0);
  totalHabitats = signal<number>(0);
  totalServices = signal<number>(0);
  totalEmploye = signal<number>(0);
  totalVet = signal<number>(0);

  constructor(private http: HttpClient) {}

  // Récupérer les statistiques de l'API au chargement initial
  getStats(): Observable<Stats> {
    return this.http.get<Stats>(this.apiUrl).pipe(
      tap((stats: Stats) => {
        console.log('Statistiques récupérées:', stats);
        this.totalAnimals.set(stats.animals);
        this.totalHabitats.set(stats.habitats);
        this.totalServices.set(stats.services);
        this.totalEmploye.set(stats.employe);
        this.totalVet.set(stats.vet);
      }),
      catchError((error) => {
        console.error(
          'Erreur lors de la récupération des statistiques:',
          error
        );
        return throwError(
          () => new Error('Erreur lors de la récupération des statistiques')
        );
      })
    );
  }

  // Méthodes pour incrémenter les statistiques
  incrementTotalAnimals() {
    this.totalAnimals.update((value) => value + 1);
  }

  decrementTotalAnimals() {
    this.totalAnimals.update((value) => value - 1);
  }

  incrementTotalHabitats() {
    this.totalHabitats.update((value) => value + 1);
  }

  decrementTotalHabitats() {
    this.totalHabitats.update((value) => value - 1);
  }

  incrementTotalServices() {
    this.totalServices.update((value) => value + 1);
  }

  decrementTotalServices() {
    this.totalServices.update((value) => value - 1);
  }

  incrementTotalEmploye() {
    this.totalEmploye.update((value) => value + 1);
  }

  decrementTotalEmploye() {
    this.totalEmploye.update((value) => value - 1);
  }

  incrementTotalVet() {
    this.totalVet.update((value) => value + 1);
  }

  decrementTotalVet() {
    this.totalVet.update((value) => value - 1);
  }
}
