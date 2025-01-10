import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageOptimizerService {
  private readonly CONFIG = {
    MAX_DIMENSION: 2048,
    QUALITY: 0.8,
    MIN_DIMENSION: 100,
  };

  async optimizeImage(file: File): Promise<File> {
    if (!file.type.startsWith('image/')) {
      throw new Error('Format de fichier invalide');
    }

    try {
      const image = await this.loadImage(file);
      const optimizedBlob = await this.processImage(image, file.type);

      return new File([optimizedBlob], this.sanitizeFileName(file.name), {
        type: file.type,
        lastModified: Date.now(),
      });
    } catch (error: unknown) {
      throw new Error(
        `Échec de l'optimisation: ${
          error instanceof Error ? error.message : 'Erreur inconnue'
        }`
      );
    }
  }

  private async processImage(
    image: HTMLImageElement,
    fileType: string
  ): Promise<Blob> {
    const { width, height } = this.calculateDimensions(image);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('Contexte 2D non disponible');

    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, 0, 0, width, height);

    return await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) =>
          blob ? resolve(blob) : reject(new Error('Échec de conversion')),
        fileType,
        this.CONFIG.QUALITY
      );
    });
  }

  /** Nettoie le nom de fichier pour le rendre sûr */
  public sanitizeFileName(fileName: string): string {
    // Supprime les caractères spéciaux et les espaces
    const cleanName = fileName
      .toLowerCase()
      .replace(/[^a-z0-9.]/g, '-')
      .replace(/-+/g, '-');

    // Extrait l'extension
    const extension = cleanName.split('.').pop();

    // Génère un nom unique avec l'extension d'origine
    const uniqueName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`;

    return `${uniqueName}.${extension}`;
  }

  private loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  private calculateDimensions(image: HTMLImageElement): {
    width: number;
    height: number;
  } {
    let { width, height } = image;

    if (
      width > this.CONFIG.MAX_DIMENSION ||
      height > this.CONFIG.MAX_DIMENSION
    ) {
      if (width > height) {
        height = Math.round((height * this.CONFIG.MAX_DIMENSION) / width);
        width = this.CONFIG.MAX_DIMENSION;
      } else {
        width = Math.round((width * this.CONFIG.MAX_DIMENSION) / height);
        height = this.CONFIG.MAX_DIMENSION;
      }
    }

    return { width, height };
  }
}
