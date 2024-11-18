export interface HabitatComment {
  id_habitat_comment: string;
  id_habitat: number;
  id_user: number;
  user_name: string;
  comment: string;
  habitat_status: string;
  createdAt: Date;
  updatedAt: Date;
}
