import { Navigate } from "react-router";
import useUserStore from "../stores/useUserStore";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useUserStore();

  // Mientras se verifica el token, muestra un loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-darkblue">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, muestra el contenido
  return <>{children}</>;
};

export default ProtectedRoute;
