/**
 * Login page
 * Allows users to authenticate in the application
 * 
 * @module LoginPage
 */

import { Link, useNavigate } from "react-router";
import Input from "../components/Input";
import { useState, useRef, type FormEvent } from "react";
import useUserStore from "../stores/useUserStore";

/**
 * Login page component
 * Includes authentication form with email and password
 * Displays rotating background video
 * 
 * @component
 * @returns {JSX.Element} Login page
 * 
 * @description
 * Features:
 * - Form with email and password validation
 * - Rotating background video (4 videos)
 * - Error handling with visual messages
 * - Loading state during authentication
 * - Links to registration and password recovery
 * - Responsive design (mobile and desktop)
 * 
 * @example
 * ```tsx
 * // Usage in App.tsx
 * <PublicRoute>
 *   <LoginPage />
 * </PublicRoute>
 * ```
 */
const LoginPage: React.FC = () => {
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Zustand store
  const { login, isLoading, error, clearError } = useUserStore();
  const navigate = useNavigate();

  /**
   * Handles the video end event
   * Changes to the next video in the array in a circular manner
   */
  const handleVideoEnd = () => {
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    setCurrentVideoIndex(nextIndex);
  };

  /**
   * Handles the login form submission
   * Attempts to authenticate the user and redirects to /home if successful
   * 
   * @async
   * @param {FormEvent} e - Form event
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login({ email, password });
      // If login is successful, redirect to home
      navigate("/home");
    } catch (error) {
      // Error is already handled in the store
      console.error("Error en login:", error);
    }
  };

  return (
    <div className="login w-full h-screen flex relative">
      <div className="auth-form w-full md:w-md flex flex-col justify-between items-center h-full text-white bg-darkblue/95 md:bg-darkblue gap-5 p-6 md:p-10 relative z-10">
        <div></div>
        <div className="flex flex-col justify-center items-center gap-3 md:gap-5">
          <h2 className="text-3xl font-semibold">Inicio de sesión</h2>
          <p className="text-base">Conéctate y vive la experiencia completa.</p>
          
          {/* Mostrar error si existe */}
          {error && (
            <div className="w-full bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded">
              {error}
            </div>
          )}

          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              type="email"
              id="email"
              label="Correo electrónico"
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="flex flex-col gap-1">
              <Input
                type="password"
                id="password"
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Link
                to="/forgot-password"
                className="text-sm text-green self-end font-semibold"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <button
              type="submit"
              className="bg-blue-medium text-white py-3 rounded h-12 font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
        <p>
          ¿No tienes una cuenta?{" "}
          <Link to="/register" className="text-green font-semibold">
            Crear una cuenta
          </Link>
        </p>
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

export default LoginPage;
