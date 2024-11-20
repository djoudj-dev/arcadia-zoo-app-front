import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileSecurityService {
  private readonly ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ];
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly MAX_IMAGE_DIMENSIONS = {
    width: 4096,
    height: 4096,
  };

  async validateFile(
    file: File
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Vérification du type MIME
    if (!this.ALLOWED_MIME_TYPES.includes(file.type)) {
      errors.push(
        'Type de fichier non autorisé. Formats acceptés : JPG, PNG, WebP, GIF'
      );
    }

    // Vérification de la taille
    if (file.size > this.MAX_FILE_SIZE) {
      errors.push('Le fichier est trop volumineux (maximum 5MB)');
    }

    // Vérification des dimensions de l'image
    try {
      const dimensions = await this.getImageDimensions(file);
      if (
        dimensions.width > this.MAX_IMAGE_DIMENSIONS.width ||
        dimensions.height > this.MAX_IMAGE_DIMENSIONS.height
      ) {
        errors.push(
          `Les dimensions de l'image sont trop grandes (max ${this.MAX_IMAGE_DIMENSIONS.width}x${this.MAX_IMAGE_DIMENSIONS.height})`
        );
      }
    } catch (error: unknown) {
      errors.push("Format d'image invalide : " + (error as Error).message);
    }

    // Vérification du contenu réel du fichier
    try {
      const isValidContent = await this.validateImageContent(file);
      if (!isValidContent) {
        errors.push('Le contenu du fichier est invalide');
      }
    } catch (error: unknown) {
      errors.push(
        `Impossible de valider le contenu du fichier : ${
          (error as Error).message
        }`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Remplace les caractères spéciaux
      .replace(/\.{2,}/g, '.') // Évite les doubles points
      .substring(0, 255); // Limite la longueur
  }

  private getImageDimensions(
    file: File
  ): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src); // Libère la mémoire
        resolve({ width: img.width, height: img.height });
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Image invalide'));
      };
      img.src = URL.createObjectURL(file);
    });
  }

  private async validateImageContent(file: File): Promise<boolean> {
    const buffer = await file.arrayBuffer();
    const header = new Uint8Array(buffer.slice(0, 4));

    // Signatures de fichiers courantes
    const signatures = {
      jpeg: [0xff, 0xd8, 0xff],
      png: [0x89, 0x50, 0x4e, 0x47],
      gif: [0x47, 0x49, 0x46, 0x38],
      webp: [0x52, 0x49, 0x46, 0x46],
    };

    return Object.values(signatures).some((signature) =>
      signature.every((byte, i) => header[i] === byte)
    );
  }
}
