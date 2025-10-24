/**
 * TypeScript types for authentication and user management
 * @module auth.types
 */

/**
 * Application user
 * @interface User
 * @property {string} id - Unique user ID
 * @property {string} name - User's full name
 * @property {string} email - User's email (used for login)
 * @property {number} age - User's age
 * @property {string[]} moviesLiked - Array of video IDs that the user likes
 */
export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  moviesLiked?: string[]; // Optional for backward compatibility
}

/**
 * Server response for authentication operations (login/register)
 * @interface AuthResponse
 * @property {User} user - Authenticated user data
 * @property {string} token - JWT token for authentication in future requests
 */
export interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Credentials for login
 * @interface LoginCredentials
 * @property {string} email - User's email
 * @property {string} password - User's password
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Required data to register a new user
 * @interface RegisterData
 * @property {string} name - Full name
 * @property {string} email - Unique email
 * @property {string} password - Password (minimum 6 characters recommended)
 * @property {number} age - User's age
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  age: number;
}

/**
 * Optional data to update user profile
 * All fields are optional, only provided ones will be updated
 * @interface UpdateUserData
 * @property {string} [name] - New name
 * @property {string} [email] - New email
 * @property {number} [age] - New age
 */
export interface UpdateUserData {
  name?: string;
  email?: string;
  age?: number;
}

/**
 * Data to change user password
 * @interface ChangePasswordData
 * @property {string} currentPassword - Current password to validate
 * @property {string} newPassword - New password
 */
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

/**
 * Data to request password recovery
 * @interface ForgotPasswordData
 * @property {string} email - Email of the user who forgot their password
 */
export interface ForgotPasswordData {
  email: string;
}

/**
 * Data to reset password with a token
 * @interface ResetPasswordData
 * @property {string} token - Token received by email
 * @property {string} newPassword - New password to set
 */
export interface ResetPasswordData {
  token: string;
  newPassword: string;
}
