export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export interface PasswordChangeForm {
  currentPassword: string;
  newPassword: string;
}

export interface PasswordChangeResponse {
  success: boolean;
  message: string;
}
