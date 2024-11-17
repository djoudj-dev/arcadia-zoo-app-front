import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';

/**
 * Composant Modal réutilisable
 * Affiche une fenêtre modale centrée avec un fond semi-transparent
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-template #modalTemplate>
      <div
        class="fixed inset-0 flex items-center justify-center z-[9999]"
        role="dialog"
        aria-modal="true"
      >
        <!-- Overlay avec effet de flou -->
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          (click)="closeModal()"
        ></div>

        <!-- Conteneur du modal -->
        <div class="fixed inset-0 flex items-center justify-center p-4">
          <div class="relative w-full">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </ng-template>
  `,
})
export class ModalComponent {
  @Input() set isOpen(value: boolean) {
    if (value) {
      this.openModal();
    } else {
      this.closeOverlay();
    }
  }
  @Output() close = new EventEmitter<void>();

  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<unknown>;

  private overlayRef: OverlayRef | null = null;

  constructor(
    private overlay: Overlay,
    private viewContainerRef: ViewContainerRef
  ) {}

  private openModal(): void {
    if (!this.overlayRef) {
      // Configuration de l'overlay
      const positionStrategy = this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically();

      const overlayConfig = {
        hasBackdrop: false, // On gère nous-même le backdrop avec Tailwind
        scrollStrategy: this.overlay.scrollStrategies.block(),
        positionStrategy,
      };

      // Création de l'overlay
      this.overlayRef = this.overlay.create(overlayConfig);

      // Création et attachement du portal
      const portal = new TemplatePortal(
        this.modalTemplate,
        this.viewContainerRef
      );
      this.overlayRef.attach(portal);

      // Bloquer le scroll du body
      document.body.classList.add('overflow-hidden');
    }
  }

  closeModal(): void {
    this.close.emit();
  }

  private closeOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
      document.body.classList.remove('overflow-hidden');
    }
  }

  ngOnDestroy(): void {
    this.closeOverlay();
  }
}
