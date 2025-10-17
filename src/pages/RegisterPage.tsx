import { Link, useNavigate } from "react-router";
import Input from "../components/Input";
import { useState, useRef, type FormEvent } from "react";
import useUserStore from "../stores/useUserStore";

const RegisterPage: React.FC = () => {
  const videos = [
    "/videos/auth-video1.mp4",
    "/videos/auth-video2.mp4",
    "/videos/auth-video3.mp4",
    "/videos/auth-video4.mp4",
  ];
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Estados del formulario
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  // Zustand store
  const { register, isLoading, error, clearError } = useUserStore();
  const navigate = useNavigate();

  const handleVideoEnd = () => {
    const nextIndex = (currentVideoIndex + 1) % videos.length;
    setCurrentVideoIndex(nextIndex);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError("");

    // Validaciones
    if (password !== confirmPassword) {
      setValidationError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setValidationError("La contraseña debe tener al menos 6 caracteres");
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
    <div className="login w-full h-screen flex relative">
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
              label="Nombre de usuario"
              placeholder="Ingresa tu nombre de usuario"
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
            <Input
              type="password"
              id="password"
              label="Contraseña"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
              className="bg-green text-white py-3 rounded h-12 font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Registrando..." : "Registrarse"}
            </button>
          </form>
        </div>
        <p>
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-lightblue font-semibold">
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
