export interface VetNote {
  id: number;
  animalId: number;
  vetId: number;
  animalState: string;
  food: string;
  foodWeight: number;
  visitDate: Date;
  additionalDetails: string;
}
