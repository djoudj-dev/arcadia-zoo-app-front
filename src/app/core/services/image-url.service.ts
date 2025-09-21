import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageUrlService {

  /**
   * Construit l'URL complète de l'image
   * @param imagePath Le chemin de l'image stocké en base
   * @returns L'URL complète de l'image
   */
  getImageUrl(imagePath: string | undefined | null): string {
    if (!imagePath) {
      return '/assets/images/placeholder.jpg'; // Image par défaut
    }

    // Si l'image est déjà une URL complète (S3 ou autre), la retourner telle quelle
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }

    // Si S3 est activé et que l'image ne commence pas par uploads/ (ancien format)
    if (environment.s3?.enabled) {
      // Si l'image commence par un dossier spécifique (habitats/, animals/, etc.)
      if (imagePath.includes('/')) {
        return `${environment.s3.baseUrl}/${imagePath}`;
      }
      // Sinon, assumer que c'est dans un dossier générique
      return `${environment.s3.baseUrl}/uploads/${imagePath}`;
    }

    // Fallback vers l'API locale
    if (imagePath.startsWith('uploads/')) {
      return `${environment.apiUrl}/api/${imagePath}`;
    }

    return `${environment.apiUrl}/api/uploads/${imagePath}`;
  }

  /**
   * Vérifie si une image est valide
   * @param imagePath Le chemin de l'image
   * @returns true si l'image semble valide
   */
  isValidImagePath(imagePath: string | undefined | null): boolean {
    if (!imagePath) return false;

    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const lowerPath = imagePath.toLowerCase();

    return validExtensions.some(ext => lowerPath.includes(ext));
  }

  /**
   * Transforme un chemin d'image local en URL S3 si nécessaire
   * @param localPath Le chemin local de l'image
   * @param folder Le dossier S3 (habitats, animals, services)
   * @returns L'URL S3 ou le chemin local selon la configuration
   */
  transformToS3Url(localPath: string, folder: string): string {
    if (!environment.s3?.enabled) {
      return localPath;
    }

    // Extraire le nom du fichier
    const filename = localPath.split('/').pop() || localPath;
    return `${environment.s3.baseUrl}/${folder}/${filename}`;
  }
}