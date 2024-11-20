/**
 * Modèle représentant les horaires d'ouverture
 */
export interface OpeningHours {
  _id?: string;
  openingHours: Array<{
    days: string;
    hours: string;
    isOpen: boolean;
    _id?: string;
  }>;
  parkStatus: boolean;
  statusMessage: string;
  isCurrent: boolean;
  updatedAt?: string;
  __v?: number;
}

/**
 * Modèle représentant le statut du parc
 */
export interface ParkStatus {
  isOpen: boolean;
  message?: string;
}

export interface OpeningHoursUpdatePayload {
  openingHours: Array<{
    days: string;
    hours: string;
    isOpen: boolean;
  }>;
  parkStatus: boolean;
  statusMessage?: string;
}

export interface OpeningHoursFormData {
  weekdayHours: string;
  weekendHours: string;
  isWeekdayOpen: boolean;
  isWeekendOpen: boolean;
  parkStatus: boolean;
  statusMessage?: string;
}
