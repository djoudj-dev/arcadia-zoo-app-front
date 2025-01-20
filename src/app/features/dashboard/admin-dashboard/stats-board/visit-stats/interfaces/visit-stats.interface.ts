export type CategoryType = 'animal' | 'habitat' | 'service';

export interface VisitTrackingData {
  categoryName: string;
  categoryType: CategoryType;
  pageId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
}

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
