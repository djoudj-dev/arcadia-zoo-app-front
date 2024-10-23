import { Component, OnInit } from '@angular/core';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { SERVICES } from '../../../core/mocks/services-mock.component';
import { SlicePipe } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-service-management',
  standalone: true,
  imports: [ButtonComponent, SlicePipe, ReactiveFormsModule],
  templateUrl: './service-management.component.html',
  styleUrls: ['./service-management.component.css'], // "styleUrls" pour le CSS
})
export class ServiceManagementComponent implements OnInit {
  serviceList = SERVICES; // Utilisé pour afficher les services
  serviceForm!: FormGroup; // Utilisé pour ajouter un service
  fileInvalid = false; // Utilisé pour afficher un message d'erreur si le fichier est invalide

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.serviceForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      description: ['', [Validators.required, Validators.minLength(10)]],
      image: [null, Validators.required],
    });
  }

  displayedServiceList = this.serviceList.map((service) => ({
    ...service,
    showFullDescription: false, // Ajout de showFullDescription pour chaque service
  }));

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const allowedTypes = [
        'image/png',
        'image/jpeg',
        'image/jpg',
        'image/gif',
        'image/svg',
        'image/webp',
      ];
      if (allowedTypes.includes(file.type)) {
        this.fileInvalid = false;
        this.serviceForm.patchValue({ image: file });
      } else {
        this.fileInvalid = true;
      }
    }
  }

  onSubmit() {
    if (this.serviceForm.valid && !this.fileInvalid) {
      // Logique pour soumettre le formulaire (appel API, etc.)
      console.log('Formulaire valide:', this.serviceForm.value);
    } else {
      console.log('Formulaire invalide');
    }
  }

  editService() {
    // Logique pour modifier le service
  }

  deleteService() {
    // Logique pour supprimer le service
  }

  toggleDescription(serviceId: number) {
    // Alterne l'état de l'affichage de la description complète
    const service = this.displayedServiceList.find((s) => s.id === serviceId);
    if (service) {
      service.showFullDescription = !service.showFullDescription;
    }
  }
}
