export interface FeedingHistory {
  id: number;
  animalId: number;
  employeId: number;
  employeName: string;
  feedingTime: string;
  foodType: string;
  quantity: number;
  notes?: string;
}

// Ajout de l'interface pour la réponse de l'API
export interface FeedingHistoryResponse {
  _id: string;
  id_feeding: number;
  animal_id: number;
  feeding_date: string;
  food_type: string;
  quantity: number;
  unit: string;
  notes: string;
  employee_id: number;
  employee_name: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_id?: number;
}
