export interface Token {
  exp: number; // Expiration timestamp
  iat: number; // Issued at timestamp
  id: string; // ID de l'utilisateur
  email?: string; // Email de l'utilisateur (facultatif, selon ton token)
  role?: string; // Rôle de l'utilisateur (facultatif)
}
