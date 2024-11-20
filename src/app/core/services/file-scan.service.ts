import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, from } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

// Définition de l'interface ExifData
interface ExifData {
  make?: string;
  model?: string;
  datetime?: string;
  [key: string]: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class FileScanService {
  private readonly VIRUS_SCAN_API = 'your-virus-scan-api-endpoint';
  private readonly MALWARE_SIGNATURES = new Set([
    '4D5A', // Signature EXE
    'FFD8FF', // Signature malveillante JPEG
    '526172', // Signature RAR
    '504B03', // Signature ZIP potentiellement dangereuse
  ]);

  constructor(private http: HttpClient) {}

  async scanFile(file: File): Promise<{ isSafe: boolean; threats: string[] }> {
    const threats: string[] = [];

    // Vérification de base du contenu
    const headerCheck = await this.checkFileHeader(file);
    if (!headerCheck.isSafe) {
      threats.push(...headerCheck.threats);
    }

    // Vérification des métadonnées
    const metadataCheck = await this.checkMetadata(file);
    if (!metadataCheck.isSafe) {
      threats.push(...metadataCheck.threats);
    }

    // Scan antivirus si disponible
    try {
      const virusScanResult = await this.performVirusScan(file);
      if (!virusScanResult.isSafe) {
        threats.push(...virusScanResult.threats);
      }
    } catch (error) {
      console.warn('Scan antivirus non disponible:', error);
    }

    return {
      isSafe: threats.length === 0,
      threats,
    };
  }

  private async checkFileHeader(
    file: File
  ): Promise<{ isSafe: boolean; threats: string[] }> {
    const threats: string[] = [];
    const buffer = await file.slice(0, 8).arrayBuffer();
    const header = Array.from(new Uint8Array(buffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();

    // Vérifie les signatures malveillantes connues
    for (const signature of this.MALWARE_SIGNATURES) {
      if (header.includes(signature)) {
        threats.push(`Signature de fichier suspecte détectée: ${signature}`);
      }
    }

    return {
      isSafe: threats.length === 0,
      threats,
    };
  }

  private async checkMetadata(
    file: File
  ): Promise<{ isSafe: boolean; threats: string[] }> {
    const threats: string[] = [];

    // Vérification des métadonnées EXIF pour les images
    if (file.type.startsWith('image/')) {
      try {
        const exifData = await this.extractExifData(file);
        if (this.hasSupiciousExifData(exifData)) {
          threats.push('Métadonnées EXIF suspectes détectées');
        }
      } catch (error) {
        console.error(
          'Erreur lors de la vérification des métadonnées EXIF:',
          error
        );
        threats.push('Impossible de vérifier les métadonnées EXIF');
      }
    }

    return {
      isSafe: threats.length === 0,
      threats,
    };
  }

  private async performVirusScan(
    file: File
  ): Promise<{ isSafe: boolean; threats: string[] }> {
    const formData = new FormData();
    formData.append('file', file);

    return firstValueFrom(
      this.http
        .post<{ isSafe: boolean; threats: string[] }>(
          this.VIRUS_SCAN_API,
          formData,
          { observe: 'response' }
        )
        .pipe(
          map(
            (response) =>
              response.body ?? {
                isSafe: false,
                threats: ['Réponse invalide du serveur'],
              }
          ),
          catchError(() =>
            from([{ isSafe: false, threats: ['Scan antivirus échoué'] }])
          )
        )
    );
  }

  private async extractExifData(file: File): Promise<ExifData> {
    // Version basique de l'extraction des métadonnées EXIF
    if (!file.type.startsWith('image/')) {
      return {};
    }

    try {
      // Simulation d'extraction de métadonnées basiques
      return {
        make: 'Unknown',
        model: 'Unknown',
        datetime: new Date().toISOString(),
      };
    } catch {
      console.warn("Impossible d'extraire les métadonnées EXIF");
      return {};
    }
  }

  private hasSupiciousExifData(exifData: ExifData): boolean {
    // Vérification basique des métadonnées suspectes
    const suspiciousPatterns = [
      /script/i,
      /eval\(/i,
      /javascript:/i,
      /base64/i,
    ];

    // Vérifie chaque propriété des métadonnées
    return Object.values(exifData).some(
      (value) =>
        typeof value === 'string' &&
        suspiciousPatterns.some((pattern) => pattern.test(value))
    );
  }
}
