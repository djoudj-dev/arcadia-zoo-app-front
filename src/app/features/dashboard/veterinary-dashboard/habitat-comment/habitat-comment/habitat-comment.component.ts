import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnInit,
  signal,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { HabitatComment } from './model/habitat-comment.model';
import { HabitatCommentService } from './service/habitat-comment.service';
import { ToastComponent } from '../../../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-habitat-comment',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent, ToastComponent],
  templateUrl: './habitat-comment.component.html',
})
export class HabitatCommentComponent implements OnInit {
  @Input() habitatId!: number;
  @Output() commentAdded = new EventEmitter<void>();

  habitatsComments = signal<HabitatComment[]>([]);
  isToastVisible = signal(false);
  toastMessage = signal('');
  toastType = signal<'success' | 'error'>('success');

  newHabitatCommentData: Partial<HabitatComment> = {
    habitat_status: 'Optimal',
    comment: '',
    id_habitat: 0,
  };

  statusOptions = [
    'Optimal',
    'Acceptable',
    'Nécessite des améliorations',
  ] as const;

  constructor(private habitatComments: HabitatCommentService) {}

  ngOnInit() {
    if (this.habitatId) {
      this.newHabitatCommentData.id_habitat = this.habitatId;
      this.loadHabitatsComments();
    }
  }

  loadHabitatsComments() {
    this.habitatComments.getCommentsByHabitatId(this.habitatId).subscribe({
      next: (comments) => {
        console.log('Commentaires chargés:', comments);
        this.habitatsComments.set(comments);
      },
      error: (error) =>
        console.error(
          'Erreur lors de la récupération des commentaires:',
          error
        ),
    });
  }

  submitComment() {
    console.log('Données à envoyer:', this.newHabitatCommentData);

    if (
      !this.newHabitatCommentData.comment ||
      !this.newHabitatCommentData.id_habitat
    ) {
      this.showToast('Veuillez remplir tous les champs', 'error');
      return;
    }

    this.habitatComments
      .createHabitatComment(this.newHabitatCommentData)
      .subscribe({
        next: (response) => {
          console.log('Commentaire créé:', response);
          this.loadHabitatsComments();
          this.newHabitatCommentData = {
            id_habitat: this.habitatId,
            habitat_status: 'Optimal',
            comment: '',
          };
          this.showToast('Commentaire ajouté avec succès', 'success');
        },
        error: (error) => {
          console.error("Erreur lors de l'ajout du commentaire:", error);
          this.showToast("Erreur lors de l'ajout du commentaire", 'error');
        },
      });
  }

  private showToast(message: string, type: 'success' | 'error') {
    this.toastMessage.set(message);
    this.toastType.set(type);
    this.isToastVisible.set(true);

    if (type === 'success') {
      setTimeout(() => {
        this.isToastVisible.set(false);
        this.commentAdded.emit();
      }, 3000);
    } else {
      setTimeout(() => {
        this.isToastVisible.set(false);
      }, 3000);
    }
  }
}
