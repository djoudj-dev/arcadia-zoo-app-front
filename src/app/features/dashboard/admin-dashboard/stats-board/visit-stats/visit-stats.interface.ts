// src/app/features/dashboard/admin-dashboard/stats-board/visit-stats/interfaces/visit-stats.interface.ts

export interface VisitStats {
  category_name: string;
  category_type: string;
  visit_count: number;
  visit_percentage: number;
  visit_duration?: number;
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
