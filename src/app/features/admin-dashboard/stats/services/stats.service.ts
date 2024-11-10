import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../../environments/environment';

interface Stats {
  totalAnimals: number;
  totalHabitats: number;
  totalServices: number;
  totalEmployes: number;
  totalVets: number;
}

@Injectable({
  providedIn: 'root',
})
export class StatsService {
  private apiUrl = environment.apiUrl + '/admin/stats-management/stats';

  // Signaux pour chaque statistique
  totalAnimals = signal<number>(0);
  totalHabitats = signal<number>(0);
  totalServices = signal<number>(0);
  totalEmploye = signal<number>(0);
  totalVet = signal<number>(0);

  constructor(private http: HttpClient) {}

  // Récupérer les statistiques de l'API au chargement initial
  getStats() {
    this.http.get<Stats>(this.apiUrl).subscribe((stats) => {
      this.totalAnimals.set(stats.totalAnimals);
      this.totalHabitats.set(stats.totalHabitats);
      this.totalServices.set(stats.totalServices);
      this.totalEmploye.set(stats.totalEmployes);
      this.totalVet.set(stats.totalVets);
    });
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
