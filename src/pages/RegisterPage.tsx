/**
 * New user registration page
 * Allows creating a new account in the application
 * 
 * @module RegisterPage
 */

import { Link, useNavigate } from "react-router";
import Input from "../components/Input";
import { useState, useRef, type FormEvent } from "react";
import useUserStore from "../stores/useUserStore";
import { validatePassword } from "../utils/validators";

/**
 * Registration page component
 * Includes complete form with secure password validations
 * 
 * @component
 * @returns {JSX.Element} Registration page
 * 
 * @description
 * Features:
 * - Form with name, age, email, password and confirmation
 * - Matching password validation
 * - Secure password validation (uppercase, numbers, special characters)
 * - Rotating background video (4 videos)
 * - Error handling with visual messages
 * - Loading state during registration
 * - Password requirements message
 * - Responsive design
 * 
 * Password requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one number
 * - At least one special character
 * 
 * @example
 * ```tsx
 * <PublicRoute>
 *   <RegisterPage />
 * </PublicRoute>
 * ```
 */
const RegisterPage: React.FC = () => {
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
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  // Zustand store
  const { register, isLoading, error, clearError } = useUserStore();
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
   * Handles the registration form submission
   * Validates passwords and creates new account
   * 
   * @async
   * @param {FormEvent} e - Form event
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError("");

    // Validations
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }

    // Validate secure password requirements
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setValidationError(passwordValidation.errors.join(". "));
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 13) {
      setValidationError("Debes tener al menos 13 años");
      return;
    }

    try {
      await register({
        name: username,
        email,
        password,
        age: ageNum,
      });
      // Si el registro es exitoso, redirige al home
      navigate("/home");
    } catch (error) {
      console.error("Error en registro:", error);
    }
  };

  return (
    <div className="login w-full min-h-screen flex relative">
      <div className="auth-form w-full md:w-md flex flex-col justify-between items-center h-full text-white bg-darkblue/95 md:bg-darkblue gap-5 p-6 md:p-10 relative z-10">
        <div></div>
        <div className="flex flex-col justify-center items-center gap-3 md:gap-5">
          <h2 className="text-3xl font-semibold">Crear una cuenta</h2>
          <p className="text-base">
            Únete y empieza a descubrir lo que te gusta.
          </p>

          {/* Mostrar errores */}
          {(error || validationError) && (
            <div className="w-full bg-red-500/20 border border-red-500 text-red-200 px-4 py-2 rounded text-sm">
              {error || validationError}
            </div>
          )}

          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            <Input
              type="text"
              id="username"
              label="Nombre Completo"
              placeholder="Ingresa tu nombre completo"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              type="number"
              id="age"
              label="Edad"
              placeholder="Ingresa tu edad"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
            <Input
              type="email"
              id="email"
              label="Correo electrónico"
              placeholder="Ingresa tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="w-full">
              <Input
                type="password"
                id="password"
                label="Contraseña"
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-white/60 mt-1">
                Mínimo 8 caracteres, una mayúscula, un número y un carácter especial
              </p>
            </div>
            <Input
              type="password"
              id="confirm-password"
              label="Confirmar contraseña"
              placeholder="Confirma tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-medium text-white py-3 rounded h-12 font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Registrando..." : "Registrarse"}
            </button>
          </form>
        </div>
        <p>
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-green font-semibold">
            Inicia sesión
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

export default RegisterPage;
