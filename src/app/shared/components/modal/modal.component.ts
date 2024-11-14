import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-modal',
  template: `
    @if (isOpen) {
    <div
      class="fixed inset-0 bg-secondary bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-secondary w-full sm:max-w-lg mx-auto p-6 rounded-lg shadow-lg relative"
      >
        <ng-content />
      </div>
    </div>
    }
  `,
})
export class ModalComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
