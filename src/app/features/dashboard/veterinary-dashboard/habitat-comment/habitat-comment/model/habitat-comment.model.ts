export interface HabitatComment {
  _id: string;
  id_habitat: number;
  habitat_name: string;
  id_user: number;
  user_name: string;
  comment: string;
  habitat_status: string;
  is_resolved: boolean;
  resolved_at: Date | null;
  resolved_by: string | null;
  createdAt: Date;
  updatedAt: Date;
}
