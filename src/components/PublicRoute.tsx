import { Navigate } from "react-router-dom";
import useUserStore from "../stores/useUserStore";
import type { ReactNode } from "react";

interface PublicRouteProps {
  children: ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useUserStore();

  // Mientras se verifica el token, muestra un loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-darkblue">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  // Si ya está autenticado, redirige al home
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // Si no está autenticado, muestra el contenido (login, register, etc.)
  return <>{children}</>;
};

export default PublicRoute;
