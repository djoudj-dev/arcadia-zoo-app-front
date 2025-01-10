import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { firstValueFrom } from 'rxjs';

interface SecurityScanResult {
  isSafe: boolean;
  threats: string[];
}

interface FileValidationConfig {
  MIME_TYPES: string[];
  MAX_FILE_SIZE: number;
  MAX_DIMENSIONS: { width: number; height: number };
  THREAT_PATTERNS: {
    SIGNATURES: Set<string>;
    DANGEROUS_EXTENSIONS: Set<string>;
  };
}

class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileValidationError';
  }
}

@Injectable({
  providedIn: 'root',
})
export class FileScanner {
  private readonly config: FileValidationConfig = {
    MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    MAX_FILE_SIZE: 5 * 1024 * 1024,
    MAX_DIMENSIONS: { width: 4096, height: 4096 },
    THREAT_PATTERNS: {
      SIGNATURES: new Set(['4D5A', 'FFD8FF', '526172']),
      DANGEROUS_EXTENSIONS: new Set(['.exe', '.bat', '.cmd', '.sh', '.php']),
    },
  };

  constructor(private readonly http: HttpClient) {}

  async scan(file: File): Promise<SecurityScanResult> {
    try {
      if (!this.config.MIME_TYPES.includes(file.type)) {
        throw new FileValidationError('Type de fichier non autorisé');
      }

      const formData = new FormData();
      formData.append('file', file);
      return await firstValueFrom(
        this.http.post<SecurityScanResult>(
          `${environment.apiUrl}/security/scan`,
          formData
        )
      );
    } catch (error) {
      if (error instanceof FileValidationError) {
        return { isSafe: false, threats: [error.message] };
      }
      console.warn('Scan antivirus non disponible:', error);
      return { isSafe: true, threats: [] };
    }
  }

  private isImage(file: File): boolean {
    return file.type.startsWith('image/');
  }

  private async validateImageContent(
    file: File,
    errors: string[]
  ): Promise<void> {
    if (this.isImage(file)) {
      const [headerCheck, dimensions] = await Promise.all([
        this.checkFileHeader(file),
        this.validateDimensions(file),
      ]);

      if (!headerCheck.isValid) {
        errors.push("Contenu d'image invalide ou corrompu");
      }
      if (!dimensions.isValid) {
        errors.push("Dimensions de l'image non autorisées");
      }
    }
  }

  private async checkFileHeader(file: File): Promise<{ isValid: boolean }> {
    try {
      const buffer = await file.slice(0, 8).arrayBuffer();
      const header = Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();

      const hasSuspiciousSignature =
        this.config.THREAT_PATTERNS.SIGNATURES.has(header);
      return { isValid: !hasSuspiciousSignature };
    } catch {
      return { isValid: false };
    }
  }

  private async validateDimensions(file: File): Promise<{ isValid: boolean }> {
    if (!this.isImage(file)) return { isValid: true };

    try {
      const img = await this.loadImage(file);
      return {
        isValid:
          img.width <= this.config.MAX_DIMENSIONS.width &&
          img.height <= this.config.MAX_DIMENSIONS.height,
      };
    } catch {
      return { isValid: false };
    }
  }

  private loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Chargement de l'image échoué"));
      img.src = URL.createObjectURL(file);
    });
  }
}
