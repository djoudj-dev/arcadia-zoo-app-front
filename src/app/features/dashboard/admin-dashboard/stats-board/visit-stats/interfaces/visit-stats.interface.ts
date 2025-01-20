export type CategoryType = 'animal' | 'habitat' | 'service';

// Interface pour l'enregistrement d'une visite (POST /api/visits/track)
export interface VisitTrackingData {
  categoryName: string;
  categoryType: CategoryType;
  pageId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
}

// Réponse de l'API pour le tracking
export interface VisitTrackingResponse {
  success: boolean;
  message: string;
}

// Format des statistiques de visite (GET /api/visits/stats)
export interface VisitStats {
  category_name: string;
  category_type: string;
  visit_count: number;
  visit_percentage: number;
  total_duration: number;
  average_duration: number;
  last_visit: Date;
}

export interface VisitResponse {
  success: boolean;
  message: string;
  data?: VisitStats[];
}

export interface ChartData {
  labels: string[];
  values: number[];
  types: string[];
}

export interface TrackingData {
  pageId: string;
  categoryName: string;
  categoryType: 'animal' | 'habitat' | 'service';
  startTime: number;
}

export interface VisitStatsResponse {
  success: boolean;
  message: string;
}
