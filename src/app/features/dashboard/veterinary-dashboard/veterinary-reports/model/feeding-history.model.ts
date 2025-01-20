export interface FeedingHistory {
  id: number;
  date: Date;
  food_type: string;
  quantity: number;
  unit: string;
  notes?: string;
  animal_id: number;
  user_id: number;
  user_name: string;
}
