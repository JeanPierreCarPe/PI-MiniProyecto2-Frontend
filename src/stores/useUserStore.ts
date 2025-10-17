import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/auth.service";
import type {
  User,
  LoginCredentials,
  RegisterData,
  UpdateUserData,
  ForgotPasswordData,
} from "../types/auth.types.js";

interface AuthState {
  // Estado
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Acciones de autenticación
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  
  // Recuperación de contraseña
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  
  // Gestión de cuenta
  updateUser: (data: UpdateUserData) => Promise<void>;
  deleteAccount: () => Promise<void>;
  
  // Verificación de token
  verifyToken: () => Promise<void>;
  
  // Utilidades
  clearError: () => void;
  setUser: (user: User) => void;
}

const useUserStore = create<AuthState>()(
  persist(
    (set) => ({
      // Estado inicial
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
          localStorage.setItem("token", response.token);
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Error al iniciar sesión";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Registro
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
          const errorMessage = error instanceof Error ? error.message : "Error al registrarse";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Logout
      logout: async () => {
        // Con JWT no necesitamos llamar al backend
        // Solo limpiamos el estado local y el token
        localStorage.removeItem("token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },

      // Recuperación de contraseña
      forgotPassword: async (data: ForgotPasswordData) => {
        set({ isLoading: true, error: null });
        try {
          await authService.forgotPassword(data);
          set({ isLoading: false });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Error al enviar correo de recuperación";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Actualizar usuario
      updateUser: async (data: UpdateUserData) => {
        const state = useUserStore.getState();
        const userId = state.user?.id;
        const currentUser = state.user;
        
        if (!userId || !currentUser) {
          throw new Error("No se encontró el usuario. Por favor, vuelve a iniciar sesión.");
        }

        set({ isLoading: true, error: null });
        try {
          const updatedUser = await authService.updateUser(userId, data);
          
          // Crear un nuevo objeto de usuario con los datos actualizados
          // Usamos los datos del backend si existen, sino mantenemos los actuales
          const newUserData: User = {
            id: userId,
            name: updatedUser.name ?? data.name ?? currentUser.name,
            email: updatedUser.email ?? data.email ?? currentUser.email,
            age: updatedUser.age ?? data.age ?? currentUser.age,
          };
          
          // Actualizar el estado con un nuevo objeto para forzar la re-renderización
          set({
            user: { ...newUserData }, // Crear una nueva referencia del objeto
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Error al actualizar perfil";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Eliminar cuenta
      deleteAccount: async () => {
        const state = useUserStore.getState();
        const currentUser = state.user;
        
        if (!currentUser || !currentUser.id) {
          throw new Error("No se encontró el usuario. Por favor, vuelve a iniciar sesión.");
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
          const errorMessage = error instanceof Error ? error.message : "Error al eliminar cuenta";
          set({
            error: errorMessage,
            isLoading: false,
          });
          throw error;
        }
      },

      // Verificar token (auto-login)
      verifyToken: async () => {
        const state = useUserStore.getState();
        const token = localStorage.getItem("token");
        
        // Si no hay token, marcar como no autenticado
        if (!token) {
          set({ isAuthenticated: false, isLoading: false });
          return;
        }

        // Si ya hay un usuario en el estado (de la persistencia), no hacer nada
        if (state.user && state.isAuthenticated) {
          console.log("Usuario ya autenticado desde persistencia:", state.user);
          set({ isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          const user = await authService.verifyToken();
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error("Error al verificar token:", error);
          // Solo limpiar si realmente falla la verificación
          // Comentamos esto para no cerrar sesión automáticamente
          // localStorage.removeItem("token");
          // set({
          //   user: null,
          //   token: null,
          //   isAuthenticated: false,
          //   isLoading: false,
          //   error: null,
          // });
          
          // En su lugar, mantener el estado actual de la persistencia
          set({ isLoading: false });
        }
      },

      // Utilidades
      clearError: () => set({ error: null }),
      setUser: (user: User) => set({ user }),
    }),
    {
      name: "user-storage", // nombre en localStorage
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useUserStore;