export interface UserOpinion {
  _id?: string;
  id_opinion?: number;
  name: string;
  message: string;
  content?: string;
  date?: Date;
  createdAt?: Date;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  validated: boolean;
  rejected: boolean;
}
