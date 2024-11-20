import { Directive, ElementRef, HostListener } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Directive({
  selector: '[appInputSecurity]',
  standalone: true,
})
export class InputSecurityDirective {
  constructor(private el: ElementRef, private sanitizer: DomSanitizer) {}

  @HostListener('input', ['$event'])
  onInput(event: InputEvent): void {
    const input = event.target as HTMLInputElement;
    const sanitizedValue = this.sanitizeInput(input.value);
    if (input.value !== sanitizedValue) {
      input.value = sanitizedValue;
      input.dispatchEvent(new Event('input'));
    }
  }

  @HostListener('paste', ['$event'])
  async onPaste(event: ClipboardEvent): Promise<void> {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text/plain') || '';
    const sanitizedText = this.sanitizeInput(pastedText);

    const input = event.target as HTMLInputElement;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;

    const currentValue = input.value;
    const newValue =
      currentValue.substring(0, start) +
      sanitizedText +
      currentValue.substring(end);

    input.value = newValue;
    input.setSelectionRange(
      start + sanitizedText.length,
      start + sanitizedText.length
    );
    input.dispatchEvent(new Event('input'));
  }

  private sanitizeInput(value: string): string {
    // Supprime les caractères dangereux et le HTML
    return value
      .replace(/<[^>]*>/g, '') // Supprime les balises HTML
      .replace(/[^\w\s.,!?@-]/g, '') // Garde uniquement les caractères sûrs
      .trim();
  }
}
