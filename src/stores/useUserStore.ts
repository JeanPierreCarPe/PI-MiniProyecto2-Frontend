/**
 * Zustand store for user authentication state management
 * Includes localStorage persistence to maintain session
 * 
 * @module useUserStore
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/auth.service";
import type {
  User,
  LoginCredentials,
  RegisterData,
  UpdateUserData,
  ForgotPasswordData,
  ResetPasswordData,
  ChangePasswordData,
} from "../types/auth.types.js";

/**
 * Authentication state interface
 * @interface AuthState
 * @property {User | null} user - Current authenticated user (includes id, name, email, age, moviesLiked), null if no session
 * @property {string | null} token - JWT authentication token
 * @property {boolean} isAuthenticated - User authentication status
 * @property {boolean} isLoading - Indicates if an operation is in progress
 * @property {string | null} error - Error message if there was a problem
 */
interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  /**
   * Logs in with credentials
   * @param {LoginCredentials} credentials - Email and password
   * @returns {Promise<void>}
   * @throws {Error} If credentials are invalid
   */
  login: (credentials: LoginCredentials) => Promise<void>;
  
  /**
   * Registers a new user
   * @param {RegisterData} data - New user data
   * @returns {Promise<void>}
   * @throws {Error} If email is already registered
   */
  register: (data: RegisterData) => Promise<void>;
  
  /**
   * Logs out the user
   * @returns {Promise<void>}
   */
  logout: () => Promise<void>;
  
  /**
   * Requests password recovery by email
   * @param {ForgotPasswordData} data - User email
   * @returns {Promise<void>}
   * @throws {Error} If email is not registered
   */
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  
  /**
   * Resets password with a token
   * @param {ResetPasswordData} data - Token and new password
   * @returns {Promise<void>}
   * @throws {Error} If token is invalid
   */
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  
  /**
   * Updates user profile data
   * @param {UpdateUserData} data - Data to update
   * @returns {Promise<void>}
   * @throws {Error} If user is not authenticated or data is invalid
   */
  updateUser: (data: UpdateUserData) => Promise<void>;
  
  /**
   * Changes user password
   * @param {ChangePasswordData} data - Current password and new password
   * @returns {Promise<void>}
   * @throws {Error} If current password is incorrect
   */
  changePassword: (data: ChangePasswordData) => Promise<void>;
  
  /**
   * Permanently deletes the user account
   * @returns {Promise<void>}
   * @throws {Error} If user is not authenticated
   */
  deleteAccount: () => Promise<void>;
  
  /**
   * Verifies stored JWT token validity
   * Executed on app load for auto-login
   * @returns {Promise<void>}
   */
  verifyToken: () => Promise<void>;
  
  /**
   * Clears the error message from state
   * @returns {void}
   */
  clearError: () => void;
  
  /**
   * Manually sets the user in state
   * @param {User} user - User to set
   * @returns {void}
   */
  setUser: (user: User) => void;
  
  /**
   * Updates the user's favorite videos array
   * Optimized to avoid unnecessary re-renders
   * @param {string[]} moviesLiked - Updated array of favorite video IDs
   * @returns {void}
   */
  updateMoviesLiked: (moviesLiked: string[]) => void;
}

/**
 * Zustand hook for authentication state
 * Includes persistence middleware to save user, token, and isAuthenticated in localStorage
 * 
 * @example
 * ```tsx
 * const { user, isAuthenticated, login, logout } = useUserStore();
 * 
 * // Use in component
 * if (isAuthenticated) {
 *   console.log('User:', user.name);
 * }
 * 
 * // Login
 * await login({ email: 'user@example.com', password: '123456' });
 * ```
 */
const useUserStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login(credentials);
          
          console.log('✓ Login successful -', response.user.name);
          console.log('Favorite videos:', response.user.moviesLiked?.length || 0);
          
          localStorage.setItem("token", response.token);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Login error";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Register
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.register(data);
          localStorage.setItem("token", response.token);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Registration error";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        // With JWT we don't need to call the backend
        // Just clear local state and token
        localStorage.removeItem("token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      // Password recovery
      forgotPassword: async (data: ForgotPasswordData) => {
        set({ isLoading: true, error: null });
        try {
          console.log("Store: Starting forgotPassword with:", data);
          const result = await authService.forgotPassword(data);
          console.log("Store: Response received:", result);
          set({ isLoading: false });
        } catch (error: unknown) {
          console.error("Store: Error in forgotPassword:", error);
          const errorMessage = error instanceof Error ? error.message : "Error sending recovery email";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Reset password
      resetPassword: async (data: ResetPasswordData) => {
        set({ isLoading: true, error: null });
        try {
          await authService.resetPassword(data);
          set({ isLoading: false });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Error resetting password";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Update user
      updateUser: async (data: UpdateUserData) => {
        const state = useUserStore.getState();
        const userId = state.user?.id;
        const currentUser = state.user;
        
        if (!userId || !currentUser) {
          throw new Error("User not found. Please log in again.");
        }

        set({ isLoading: true, error: null });
        try {
          const updatedUser = await authService.updateUser(userId, data);
          
          // Create a new user object with updated data
          // Keep moviesLiked and other fields that are not updated
          const newUserData: User = {
            id: userId,
            name: updatedUser.name ?? data.name ?? currentUser.name,
            email: updatedUser.email ?? data.email ?? currentUser.email,
            age: updatedUser.age ?? data.age ?? currentUser.age,
            moviesLiked: updatedUser.moviesLiked ?? currentUser.moviesLiked, // Preserve moviesLiked
          };
          
          // Update state with a new object to force re-render
          set({
            user: { ...newUserData }, // Create a new object reference
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Error updating profile";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Change password
      changePassword: async (data: ChangePasswordData) => {
        const state = useUserStore.getState();
        const userId = state.user?.id;
        
        if (!userId) {
          throw new Error("User not found. Please log in again.");
        }

        set({ isLoading: true, error: null });
        try {
          await authService.changePassword(data);
          set({
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Error changing password";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Delete account
      deleteAccount: async () => {
        const state = useUserStore.getState();
        const currentUser = state.user;
        
        if (!currentUser || !currentUser.id) {
          throw new Error("User not found. Please log in again.");
        }

        set({ isLoading: true, error: null });
        try {
          await authService.deleteAccount(currentUser);
          localStorage.removeItem("token");
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Error deleting account";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Verify token (auto-login)
      verifyToken: async () => {
        const state = useUserStore.getState();
        const token = localStorage.getItem("token");
        
        // If no token, mark as not authenticated
        if (!token) {
          set({ isAuthenticated: false, isLoading: false });
          return;
        }

        // If there's already a user in state (from persistence), do nothing
        if (state.user && state.isAuthenticated) {
          console.log("✓ User authenticated -", state.user.name);
          console.log("Favorite videos:", state.user.moviesLiked?.length || 0);
          set({ isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authService.verifyToken();
          
          console.log('✓ Token verified -', user.name);
          console.log('Favorite videos:', user.moviesLiked?.length || 0);
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error("Error verifying token:", error);
          // Only clear if verification truly fails
          // We comment this to not auto-logout
          // localStorage.removeItem("token");
          // set({
          //   user: null,
          //   token: null,
          //   isAuthenticated: false,
          //   isLoading: false,
          //   error: null,
          // });
          
          // Instead, maintain current state from persistence
          set({ isLoading: false });
        }
      },

      // Utilities
      clearError: () => set({ error: null }),
      setUser: (user: User) => set({ user }),
      
      /**
       * Updates only the moviesLiked array without affecting other fields
       * Optimized to avoid re-renders of the VideoPage component
       */
      updateMoviesLiked: (moviesLiked: string[]) => {
        const state = useUserStore.getState();
        if (state.user) {
          set({
            user: {
              ...state.user,
              moviesLiked
            }
          });
        }
      },
    }),
    {
      name: "user-storage", // name in localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useUserStore;