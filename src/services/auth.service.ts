// Servicio de autenticación - Listo para conectar con el backend

import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  UpdateUserData,
  ForgotPasswordData,
  ResetPasswordData,
  User,
} from "../types/auth.types.js";

// URL del backend configurada desde .env
const API_URL = import.meta.env.VITE_API_URL;


// Helper para manejar errores de API
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "Error en la solicitud",
    }));
    throw new Error(error.message || `Error ${response.status}`);
  }
  return response.json();
};

// Helper para obtener headers con token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const authService = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  // Registro
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Verificar token (para auto-login)
  async verifyToken(): Promise<User> {
    const response = await fetch(`${API_URL}/auth/verify`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Recuperación de contraseña (enviar email)
  async forgotPassword(data: ForgotPasswordData): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Resetear contraseña con token
  async resetPassword(data: ResetPasswordData): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Actualizar perfil de usuario
  async updateUser(userId: string, data: UpdateUserData): Promise<User> {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Eliminar cuenta
  async deleteAccount(data: User): Promise<User> {
    const response = await fetch(`${API_URL}/users/${data.id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Logout (invalidar token en backend si es necesario)
  async logout(): Promise<void> {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
    } catch (error) {
      // Incluso si falla, limpiamos el token local
      console.error("Error en logout:", error);
    }
  },
};
