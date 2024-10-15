import { Component, Input, Output, EventEmitter } from '@angular/core';

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
        <!-- Close button -->
        <button
          (click)="closeModal()"
          class="absolute top-2 right-2 text-quinary hover:text-gray-600"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
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
