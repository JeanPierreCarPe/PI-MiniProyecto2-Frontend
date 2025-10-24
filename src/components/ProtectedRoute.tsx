import { Navigate } from "react-router";
import useUserStore from "../stores/useUserStore";
import type { ReactNode } from "react";

/**
 * Props for the ProtectedRoute component
 * @typedef {Object} ProtectedRouteProps
 * @property {ReactNode} children - Component or content rendered if user is authenticated
 */
interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Protected route component that requires authentication
 * Verifies user authentication status and redirects to login if not authenticated
 * Shows loading while verifying token
 * 
 * @component
 * @param {ProtectedRouteProps} props - Component props
 * @returns {JSX.Element} Protected content, loading, or redirect to login
 * 
 * @example
 * ```tsx
 * <ProtectedRoute>
 *   <HomePage />
 * </ProtectedRoute>
 * ```
 * 
 * @description
 * Component states:
 * - isLoading: Shows loading screen
 * - !isAuthenticated: Redirects to /login
 * - isAuthenticated: Shows content (children)
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useUserStore();

  // While verifying token, show loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-darkblue">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, show content
  return <>{children}</>;
};

export default ProtectedRoute;
