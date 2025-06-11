import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class ValidationUtils {
  static email(control: AbstractControl): ValidationErrors | null {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(control.value) ? null : { email: true };
  }

  static phone(control: AbstractControl): ValidationErrors | null {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(control.value) ? null : { phone: true };
  }

  static strongPassword(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isValidLength = value.length >= 8;

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && isValidLength;

    return passwordValid ? null : {
      strongPassword: {
        hasUpperCase,
        hasLowerCase,
        hasNumeric,
        hasSpecialChar,
        isValidLength
      }
    };
  }

  static matchPasswords(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordField);
      const confirmPassword = control.get(confirmPasswordField);

      if (!password || !confirmPassword) return null;

      return password.value === confirmPassword.value ? null : { passwordMismatch: true };
    };
  }

  static minAge(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const birthDate = new Date(control.value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= minAge ? null : { minAge: { requiredAge: minAge, actualAge: age - 1 } };
      }

      return age >= minAge ? null : { minAge: { requiredAge: minAge, actualAge: age } };
    };
  }

  static fileSize(maxSizeInMB: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;
      if (!file) return null;

      const fileSizeInMB = file.size / (1024 * 1024);
      return fileSizeInMB <= maxSizeInMB ? null : { 
        fileSize: { 
          maxSize: maxSizeInMB, 
          actualSize: Math.round(fileSizeInMB * 100) / 100 
        } 
      };
    };
  }

  static fileType(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value;
      if (!file) return null;

      const fileType = file.type;
      return allowedTypes.includes(fileType) ? null : { 
        fileType: { 
          allowedTypes, 
          actualType: fileType 
        } 
      };
    };
  }

  static getErrorMessage(control: AbstractControl, fieldName: string): string {
    if (control.hasError('required')) {
      return `${fieldName} is required`;
    }
    if (control.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (control.hasError('phone')) {
      return 'Please enter a valid phone number';
    }
    if (control.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength'].requiredLength;
      return `${fieldName} must be at least ${requiredLength} characters`;
    }
    if (control.hasError('maxlength')) {
      const requiredLength = control.errors?.['maxlength'].requiredLength;
      return `${fieldName} must not exceed ${requiredLength} characters`;
    }
    if (control.hasError('min')) {
      const min = control.errors?.['min'].min;
      return `${fieldName} must be at least ${min}`;
    }
    if (control.hasError('max')) {
      const max = control.errors?.['max'].max;
      return `${fieldName} must not exceed ${max}`;
    }
    if (control.hasError('strongPassword')) {
      return 'Password must contain uppercase, lowercase, number, and special character';
    }
    if (control.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    if (control.hasError('minAge')) {
      const requiredAge = control.errors?.['minAge'].requiredAge;
      return `Must be at least ${requiredAge} years old`;
    }
    if (control.hasError('fileSize')) {
      const maxSize = control.errors?.['fileSize'].maxSize;
      return `File size must not exceed ${maxSize}MB`;
    }
    if (control.hasError('fileType')) {
      const allowedTypes = control.errors?.['fileType'].allowedTypes.join(', ');
      return `File type must be one of: ${allowedTypes}`;
    }

    return `${fieldName} is invalid`;
  }
}