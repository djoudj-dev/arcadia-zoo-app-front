export interface FeedingData {
  id?: number;
  feedingTime: Date;
  foodType: string;
  quantity: number;
  animalId: number;
  employeId: number;
  employeName: string;
  notes: string;
  user_id?: number;
  user_name?: string;
}
