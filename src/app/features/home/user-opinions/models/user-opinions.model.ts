export interface UserOpinion {
  _id: string;
  id?: number;
  content: string;
  status: string;
  author: string;
  validated: boolean;
  rejected: boolean;
  createdAt: Date;
  rating: number;
  name?: string;
  message?: string;
  date?: Date;
}
