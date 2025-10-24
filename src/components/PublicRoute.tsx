/**
 * Public route component
 * Redirects authenticated users to home
 * 
 * @module PublicRoute
 */

import { Navigate } from "react-router-dom";
import useUserStore from "../stores/useUserStore";
import type { ReactNode } from "react";

/**
 * Props for the PublicRoute component
 * @typedef {Object} PublicRouteProps
 * @property {ReactNode} children - Component or content rendered if user is NOT authenticated
 */
interface PublicRouteProps {
  children: ReactNode;
}

/**
 * Public route component (for authentication pages)
 * Prevents authenticated users from accessing login/register
 * Automatically redirects to /home if there's an active session
 * 
 * @component
 * @param {PublicRouteProps} props - Component props
 * @returns {JSX.Element} Public content, loading, or redirect to home
 * 
 * @description
 * Component states:
 * - isLoading: Shows loading screen
 * - isAuthenticated: Redirects to /home
 * - !isAuthenticated: Shows content (login, register, etc.)
 * 
 * Use cases:
 * - Login pages
 * - Registration pages
 * - Password recovery
 * - Password reset
 * 
 * @example
 * ```tsx
 * <PublicRoute>
 *   <LoginPage />
 * </PublicRoute>
 * ```
 * 
 * @example
 * ```tsx
 * <PublicRoute>
 *   <RegisterPage />
 * </PublicRoute>
 * ```
 */
const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useUserStore();

  // While verifying token, show loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-darkblue">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // If not authenticated, show content (login, register, etc.)
  return <>{children}</>;
};

export default PublicRoute;
