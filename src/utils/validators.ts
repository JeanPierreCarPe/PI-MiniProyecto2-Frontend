/**
 * @fileoverview Form validation utilities
 * @module utils/validators
 */

/**
 * Interface for password validation result
 */
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Validates that a password meets security requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one number
 * - At least one special character
 * 
 * @param password - The password to validate
 * @returns Object with isValid (boolean) and errors array
 * 
 * @example
 * const result = validatePassword("MyPass123!");
 * if (!result.isValid) {
 *   console.log(result.errors); // Array of error messages
 * }
 */
export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];

  // Minimum 8 characters
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  // At least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  // At least one number
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  // At least one special character
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push("Password must contain at least one special character (!@#$%^&*()_+-=[]{}...)");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Gets a help message with password requirements
 * 
 * @returns String with password requirements
 */
export const getPasswordRequirements = (): string => {
  return "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character";
};
