/**
 * Password reset page with token
 * Allows setting a new password using the token received by email
 * 
 * @module ResetPassword
 */

import { Link, useParams, useNavigate } from "react-router";
import Input from "../components/Input";
import { useState, useRef, type FormEvent } from "react";
import useUserStore from "../stores/useUserStore";
import { validatePassword } from "../utils/validators";

/**
 * Password reset page component
 * Uses URL token to validate and allow password change
 * 
 * @component
 * @returns {JSX.Element} Password reset page
 * 
 * @description
 * Features:
 * - Extracts token from URL params (/reset-password/:token)
 * - Form with new password and confirmation
 * - Secure password validation
 * - Show/hide password
 * - Rotating background video
 * - Success message with redirect to login
 * - Error handling (invalid/expired token)
 * - Loading state
 * 
 * Password requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one number
 * - At least one special character
 * 
 * Flow:
 * 1. User arrives with token in URL
 * 2. Enters new password and confirms
 * 3. System validates token and updates password
 * 4. Automatic redirect to login after 3 seconds
 * 
 * @example
 * ```tsx
 * <PublicRoute>
 *   <ResetPassword />
 * </PublicRoute>
 * ```
 */
const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  /**
   * Array of video paths for the background
   * @constant {string[]}
   */
  const videos = [
    "/videos/auth-video1.mp4",
    "/videos/auth-video2.mp4",
    "/videos/auth-video3.mp4",
    "/videos/auth-video4.mp4",
  ];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Form states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  // Zustand store
  const { resetPassword, isLoading, error, clearError } = useUserStore();

  /**
   * Handles the video end event
   * Changes to the next video in the array in a circular manner
   */
  const handleVideoEnd = () => {
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    setCurrentVideoIndex(nextIndex);
  };

  /**
   * Handles the reset form submission
   * Validates passwords and updates with token
   * 
   * @async
   * @param {FormEvent} e - Form event
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setSuccess(false);

    // Validaciones
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    // Validar requisitos de contraseña segura
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      alert(passwordValidation.errors.join("\n"));
      return;
    }

    if (!token) {
      alert("Token inválido o no proporcionado");
      return;
    }

    try {
      await resetPassword({ token, newPassword });
      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error al resetear contraseña:", error);
    }
  };

  return (
    <div className="login w-full min-h-screen flex relative">
      <div className="auth-form w-full md:w-md flex flex-col justify-between items-center h-full text-white bg-darkblue/95 md:bg-darkblue gap-5 p-6 md:p-10 relative z-10">
        <div></div>
        <div className="flex flex-col justify-center items-center gap-3 md:gap-5">
          <h2 className="text-3xl font-semibold text-center">
            Restablecer Contraseña
          </h2>
          <p className="text-base text-center">
            Ingresa tu nueva contraseña. Debe tener al menos 8 caracteres, incluir una mayúscula, un número y un carácter especial.
          </p>

          {/* Mostrar mensaje de éxito */}
          {success && (
            <div className="w-full bg-green-500/20 border border-green-500 text-green-200 px-4 py-2 rounded text-sm">
              ¡Contraseña actualizada exitosamente! Redirigiendo al login...
            </div>
          )}

          {/* Mostrar error */}
          {error && (
            <div className="w-full bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded text-sm">
              {error}
            </div>
          )}

          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                label="Nueva Contraseña"
                placeholder="Ingresa tu nueva contraseña"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[42px] text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? "" : ""}
              </button>
            </div>

            <Input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              label="Confirmar Contraseña"
              placeholder="Confirma tu nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="bg-blue-medium text-white py-3 rounded h-12 font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Actualizando..." : "Restablecer Contraseña"}
            </button>
          </form>
        </div>
        <Link to="/login" className="text-green font-semibold">
          Volver al inicio de sesión
        </Link>
      </div>
      <div className="auth-image flex-1 absolute md:relative inset-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          src={videos[currentVideoIndex]}
          autoPlay
          muted
          onEnded={handleVideoEnd}
        />
      </div>
    </div>
  );
};

export default ResetPassword;
