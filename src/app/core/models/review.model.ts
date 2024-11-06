export interface Review {
  readonly id: number;
  name: string;
  date: string;
  message: string;
  rating: number;
  accepted: boolean;
  validated: boolean;
  publishedAt?: Date;
}
