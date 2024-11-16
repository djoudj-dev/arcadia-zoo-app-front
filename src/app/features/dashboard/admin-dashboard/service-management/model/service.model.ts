import { Feature } from './feature.model';

export interface Service {
  id_service?: number;
  name: string;
  description: string;
  images: string;
  feature_ids?: number[];
  features?: Feature[];
  showFullDescription?: boolean;
}
