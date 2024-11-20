import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { FileSecurityService } from 'app/core/services/file-security.service';
import { FileScanService } from 'app/core/services/file-scan.service';
import { ImageOptimizerService } from 'app/core/services/image-optimizer.service';
import { ToastService } from '../components/toast/services/toast.service';

@Directive({
  selector: '[appFileUpload]',
  standalone: true,
})
export class FileUploadDirective {
  @Input() maxSize = 5 * 1024 * 1024; // 5MB par défaut
  @Input() allowedTypes: string[] = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ];
  @Input() scanFile = true;
  @Input() optimizeImage = true;
  @Output() fileSelected = new EventEmitter<File>();
  @Output() processingStatus = new EventEmitter<string>();

  constructor(
    private fileSecurityService: FileSecurityService,
    private fileScanService: FileScanService,
    private imageOptimizerService: ImageOptimizerService,
    private toastService: ToastService
  ) {}

  @HostListener('change', ['$event'])
  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    try {
      this.processingStatus.emit('Validation du fichier...');

      // Validation de base
      const validation = await this.fileSecurityService.validateFile(file);
      if (!validation.isValid) {
        this.toastService.showError(validation.errors.join('\n'));
        this.resetInput(input);
        return;
      }

      // Scan antivirus si activé
      if (this.scanFile) {
        this.processingStatus.emit('Scan de sécurité...');
        const scanResult = await this.fileScanService.scanFile(file);
        if (!scanResult.isSafe) {
          this.toastService.showError(
            'Fichier potentiellement dangereux détecté'
          );
          this.resetInput(input);
          return;
        }
      }

      // Optimisation d'image si activée et si c'est une image
      let processedFile = file;
      if (this.optimizeImage && file.type.startsWith('image/')) {
        this.processingStatus.emit("Optimisation de l'image...");
        processedFile = await this.imageOptimizerService.optimizeImage(file);
      }

      // Sécurisation finale du nom de fichier
      const secureName = this.fileSecurityService.sanitizeFileName(
        processedFile.name
      );
      const finalFile = new File([processedFile], secureName, {
        type: processedFile.type,
      });

      this.processingStatus.emit('Terminé');
      this.fileSelected.emit(finalFile);
      this.toastService.showSuccess('Fichier traité avec succès');
    } catch (error) {
      console.error('Erreur lors du traitement du fichier:', error);
      this.toastService.showError('Erreur lors du traitement du fichier');
      this.resetInput(input);
    }
  }

  private resetInput(input: HTMLInputElement): void {
    input.value = '';
    this.processingStatus.emit('');
  }
}
