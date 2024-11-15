import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex justify-center items-center mt-10">
      <p class="text-gray-500 text-lg"></p>
    </div>
  `,
})
export class EmptyStateComponent {}
