import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageOptimizerService {
  private readonly MAX_DIMENSION = 2048;
  private readonly QUALITY = 0.8;

  async optimizeImage(file: File): Promise<File> {
    if (!file.type.startsWith('image/')) {
      throw new Error("Le fichier n'est pas une image");
    }

    try {
      // Charge l'image
      const image = await this.loadImage(file);

      // Redimensionne si nécessaire
      const { width, height } = this.calculateDimensions(image);

      // Crée un canvas pour l'optimisation
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      // Dessine l'image redimensionnée
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Impossible de créer le contexte 2D');

      ctx.drawImage(image, 0, 0, width, height);

      // Convertit en blob avec compression
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), file.type, this.QUALITY);
      });

      // Crée un nouveau fichier optimisé
      return new File([blob], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });
    } catch (error) {
      console.error("Erreur lors de l'optimisation de l'image:", error);
      throw error;
    }
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

    if (width > this.MAX_DIMENSION || height > this.MAX_DIMENSION) {
      if (width > height) {
        height = Math.round((height * this.MAX_DIMENSION) / width);
        width = this.MAX_DIMENSION;
      } else {
        width = Math.round((width * this.MAX_DIMENSION) / height);
        height = this.MAX_DIMENSION;
      }
    }

    return { width, height };
  }
}
