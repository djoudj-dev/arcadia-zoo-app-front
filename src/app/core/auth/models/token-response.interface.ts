/**
 * Interface représentant la réponse de l'API d'authentification
 */
export interface TokenResponse {
  /** Token d'accès JWT */
  accessToken: string;

  /** Token de rafraîchissement */
  refreshToken: string;

  /** Durée de validité du token en secondes */
  expiresIn: number;

  /** Type du token (généralement 'Bearer') */
  tokenType: 'Bearer';
}
