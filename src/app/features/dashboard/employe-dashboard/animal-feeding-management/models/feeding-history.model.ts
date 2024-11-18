export interface FeedingHistory {
  _id: string;
  animalId: string;
  feedingTime: Date;
  foodType: string;
  quantity: number;
  notes: string;
  user_name: string;
}

// Ajout de l'interface pour la réponse de l'API
export interface FeedingHistoryResponse {
  user_id: number;
  _id: string;
  id_feeding: number;
  animal_id: number;
  feeding_date: string;
  food_type: string;
  quantity: number;
  notes: string;
  status: string;
  unit: string;
  employe_id: number;
  user_name: string;
  created_at: string;
  updated_at: string;
  __v: number;
}
