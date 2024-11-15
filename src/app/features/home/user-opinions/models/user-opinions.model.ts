export interface UserOpinions {
  id: number;
  name: string;
  rating: number;
  message: string;
  date: string | Date;
  validated: boolean;
}
