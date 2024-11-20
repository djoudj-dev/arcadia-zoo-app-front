import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static readonly PASSWORD_PATTERN =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  static readonly NAME_PATTERN = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/;
  static readonly SAFE_TEXT_PATTERN = /^[a-zA-ZÀ-ÿ0-9\s.,!?'"()\-]{1,500}$/;

  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasSpecialChar = /[@$!%*?&]/.test(value);

      const errors: ValidationErrors = {};
      if (!hasUpperCase) errors['noUpperCase'] = true;
      if (!hasLowerCase) errors['noLowerCase'] = true;
      if (!hasNumeric) errors['noNumeric'] = true;
      if (!hasSpecialChar) errors['noSpecialChar'] = true;

      return Object.keys(errors).length ? errors : null;
    };
  }

  static fileType(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value as File;
      if (!file) return null;

      const fileType = file.type;
      if (!allowedTypes.includes(fileType)) {
        return { invalidFileType: true };
      }
      return null;
    };
  }

  static maxFileSize(maxSize: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value as File;
      if (!file) return null;

      const fileSize = file.size;
      if (fileSize > maxSize) {
        return { maxSizeExceeded: true };
      }
      return null;
    };
  }

  static noHtml(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const containsHtml = /<[^>]*>/g.test(value);
      return containsHtml ? { containsHtml: true } : null;
    };
  }
}
