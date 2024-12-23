import { Component, computed, OnInit, signal } from '@angular/core';
import { ToastService } from 'app/shared/components/toast/services/toast.service';
import { HabitatService } from '../../../habitats/service/habitat.service';
import { Habitat } from '../habitat-management/model/habitat.model';
import { CountResourceService } from '../stats-board/counts-resource/services/count-resource.service';
import { Animal } from './model/animal.model';
import { AnimalManagementService } from './service/animal-management.service';

@Component({
  selector: 'app-animal-management',
  templateUrl: './animal-management.component.html',
})
export class AnimalManagementComponent implements OnInit {
  animals = signal<Animal[]>([]);
  habitats = signal<Habitat[]>([]);
  selectedHabitat = signal<number | null>(null);
  selectedFile = signal<File | null>(null);
  newAnimalData = signal<Partial<Animal>>({});
  animalToDelete: number | null = null;

  filteredAnimals = computed(() =>
    this.animals().filter(
      (animal) => animal.habitat_id === this.selectedHabitat()
    )
  );

  constructor(
    private readonly animalManagement: AnimalManagementService,
    private readonly habitatService: HabitatService,
    private readonly countResourceService: CountResourceService,
    private readonly toastService: ToastService
  ) {}

  ngOnInit() {
    this.loadHabitats();
    this.loadAnimals();
  }

  private loadHabitats() {
    this.habitatService.getHabitats().subscribe({
      next: (habitats) => this.habitats.set(habitats),
      error: (err) => {
        console.error('Erreur chargement habitats:', err);
        this.toastService.showError('Erreur chargement habitats');
      },
    });
  }

  private loadAnimals() {
    this.animalManagement.getAllAnimals().subscribe({
      next: (animals) => this.animals.set(animals),
      error: (err) => {
        console.error('Erreur chargement animaux:', err);
        this.toastService.showError('Erreur chargement animaux');
      },
    });
  }

  createAnimal() {
    if (!this.validateAnimalData()) {
      this.toastService.showError('Champs requis manquants');
      return;
    }

    const formData = this.buildFormData();
    this.animalManagement.createAnimal(formData).subscribe({
      next: () => {
        this.loadAnimals();
        this.toastService.showSuccess('Animal créé');
      },
      error: (err) => {
        console.error('Erreur création animal:', err);
        this.toastService.showError('Erreur création animal');
      },
    });
  }

  updateAnimal() {
    if (!this.validateAnimalData(true)) {
      this.toastService.showError('Champs requis manquants');
      return;
    }

    const formData = this.buildFormData();
    const animalId = this.newAnimalData().id_animal!.toString();

    this.animalManagement.updateAnimal(animalId, formData).subscribe({
      next: () => {
        this.loadAnimals();
        this.toastService.showSuccess('Animal mis à jour');
      },
      error: (err) => {
        console.error('Erreur mise à jour animal:', err);
        this.toastService.showError('Erreur mise à jour animal');
      },
    });
  }

  deleteAnimal(id: number) {
    this.animalManagement.deleteAnimal(id.toString()).subscribe({
      next: () => {
        this.loadAnimals();
        this.toastService.showSuccess('Animal supprimé');
      },
      error: (err) => {
        console.error('Erreur suppression animal:', err);
        this.toastService.showError('Erreur suppression animal');
      },
    });
  }

  private validateAnimalData(isUpdate = false): boolean {
    const requiredFields = [
      this.newAnimalData().name,
      this.newAnimalData().species,
      this.newAnimalData().habitat_id,
      this.newAnimalData().diet,
    ];

    if (isUpdate) requiredFields.push(this.newAnimalData().id_animal);
    return requiredFields.every(
      (field) => field !== undefined && field !== null
    );
  }

  private buildFormData(): FormData {
    const formData = new FormData();
    const animalData = this.newAnimalData();

    Object.entries(animalData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value, value.name);
        } else {
          formData.append(
            key,
            typeof value === 'object' ? JSON.stringify(value) : value.toString()
          );
        }
      }
    });

    const file = this.selectedFile();
    if (file) {
      formData.append('images', file, file.name);
    }

    return formData;
  }
}
