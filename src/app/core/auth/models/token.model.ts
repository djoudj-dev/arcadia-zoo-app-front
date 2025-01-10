/**
 * Interface représentant le payload décodé d'un JWT
 */
export interface Token {
  /** Timestamp d'expiration du token (en secondes) */
  exp: number;

  /** Timestamp de création du token (en secondes) */
  iat: number;

  /** Identifiant unique de l'utilisateur */
  id: string;

  /** Email de l'utilisateur */
  email: string;

  /** Rôle de l'utilisateur (USER, ADMIN, etc.) */
  role: UserRole;

  /** Version du token pour invalidation */
  version?: number;
}

/**
 * Énumération des rôles possibles
 */
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
}
