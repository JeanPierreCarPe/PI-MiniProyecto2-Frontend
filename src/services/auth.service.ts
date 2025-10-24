/**
 * Authentication service to interact with the backend
 * Handles login, registration, token verification, password recovery and user management
 * 
 * @module authService
 */

import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UpdateUserData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
  User,
} from "../types/auth.types.js";

/**
 * Backend base URL obtained from environment variables
 * @constant {string}
 */
const API_URL = import.meta.env.VITE_API_URL;

/**
 * Handles HTTP request responses
 * Parses backend errors and throws exceptions with descriptive messages
 * 
 * @async
 * @param {Response} response - Fetch response
 * @returns {Promise<any>} Parsed JSON response
 * @throws {Error} If response is not successful (status code >= 400)
 */
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Request error",
    }));
    throw new Error(error.message || error.error || `Error ${response.status}: ${response.statusText}`);
  }
  return response.json();
};

/**
 * Gets authentication headers with JWT token
 * Includes token from localStorage if it exists
 * 
 * @returns {Object} Headers with Content-Type and Authorization (if token exists)
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Authentication and user management service
 * @namespace authService
 */
export const authService = {
  /**
   * Logs in with user credentials
   * @async
   * @param {LoginCredentials} credentials - User's email and password
   * @returns {Promise<AuthResponse>} Authenticated user and JWT token
   * @throws {Error} If credentials are invalid
   * @example
   * const { user, token } = await authService.login({ email: 'user@example.com', password: '123456' });
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    
    return handleResponse(response);
  },

  /**
   * Registers a new user in the application
   * @async
   * @param {RegisterData} data - New user data (name, email, password, age)
   * @returns {Promise<AuthResponse>} Registered user and JWT token
   * @throws {Error} If email is already registered or data is invalid
   * @example
   * const { user, token } = await authService.register({ name: 'Juan', email: 'juan@example.com', password: '123456', age: 25 });
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Verifies the validity of the stored JWT token
   * Used for auto-login when loading the application
   * @async
   * @returns {Promise<User>} User data if token is valid
   * @throws {Error} If token is invalid or expired
   * @example
   * const user = await authService.verifyToken();
   */
  async verifyToken(): Promise<User> {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    
    return handleResponse(response);
  },

  /**
   * Requests a password recovery email
   * @async
   * @param {ForgotPasswordData} data - User's email
   * @returns {Promise<{message: string}>} Confirmation message
   * @throws {Error} If email is not registered
   * @example
   * await authService.forgotPassword({ email: 'user@example.com' });
   */
  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Resets password using the token received by email
   * @async
   * @param {ResetPasswordData} data - Reset token and new password
   * @returns {Promise<{message: string}>} Confirmation message
   * @throws {Error} If token is invalid or expired
   * @example
   * await authService.resetPassword({ token: 'reset-token-123', newPassword: 'newpass123' });
   */
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Updates user profile data
   * @async
   * @param {string} userId - ID of user to update
   * @param {UpdateUserData} data - Data to update (name, email, age)
   * @returns {Promise<User>} Updated user
   * @throws {Error} If user doesn't exist or data is invalid
   * @example
   * const updatedUser = await authService.updateUser('user-id-123', { name: 'Juan Carlos' });
   */
  async updateUser(userId: string, data: UpdateUserData): Promise<User> {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Changes user password
   * Requires current password to validate action
   * @async
   * @param {string} userId - User ID
   * @param {ChangePasswordData} data - Current password and new password
   * @returns {Promise<{message: string}>} Confirmation message
   * @throws {Error} If current password is incorrect
   * @example
   * await authService.changePassword('user-id-123', { currentPassword: 'old123', newPassword: 'new456' });
   */
  async changePassword( data: ChangePasswordData): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/change-password`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  /**
   * Permanently deletes user account
   * @async
   * @param {User} data - User data to delete
   * @returns {Promise<User>} Deleted user
   * @throws {Error} If user doesn't exist
   * @example
   * await authService.deleteAccount(currentUser);
   */
  async deleteAccount(data: User): Promise<User> {
    const response = await fetch(`${API_URL}/users/${data.id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  /**
   * Logs out the user
   * Attempts to invalidate token on backend (if implemented)
   * Doesn't throw error if it fails, as local token is cleared anyway
   * @async
   * @returns {Promise<void>}
   * @example
   * await authService.logout();
   */
  async logout(): Promise<void> {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
    } catch (error) {
      // Even if it fails, we clear the local token
      console.error("Logout error:", error);
    }
  },
};
