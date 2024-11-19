export interface VeterinaryReports {
  _id?: string;
  id_veterinary_reports?: string;
  id_animal: number;
  id_user: number;
  user_name: string;
  animal_name: string;
  visit_date: Date;
  animal_state: string;
  animal_photo?: string;

  // Recommandations alimentaires
  recommended_food_type: string;
  recommended_food_quantity: number;
  food_unit: string;

  // Champ optionnel
  additional_details?: string;

  createdAt: Date;
  updatedAt: Date;
  is_processed?: boolean;
  is_treated?: boolean;
}

// Enum pour les états possibles de l'animal
export enum AnimalState {
  GOOD_HEALTH = 'Bonne santé',
  INJURED = 'Blessé',
  SICK = 'Malade',
}

// Enum pour les unités de mesure
export enum FoodUnit {
  GRAM = 'g',
  KILOGRAM = 'kg',
}
