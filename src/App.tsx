/**
 * Main application component
 * Configures React Router routing with public and protected routes
 * 
 * @module App
 */

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Layout from "./components/Layout";
import ProfilePage from "./pages/ProfilePage";
import SearchPage from "./pages/SearchPage";
import LikedPage from "./pages/LikedPage";
import AboutUsPage from "./pages/AboutUsPage";
import SiteMapPage from "./pages/SiteMapPage";
import VideoPage from "./pages/VideoPage";
import UserManualPage from "./pages/UserManualPage";

/**
 * Root application component
 * Defines the route structure and navigation of the application
 * 
 * @component
 * @returns {JSX.Element} Application with configured routing
 * 
 * @description
 * Public routes (do not require authentication):
 * - /login - Login page
 * - /register - Registration page
 * - /forgot-password - Request password recovery
 * - /reset-password/:token - Reset password with token
 * 
 * Protected routes (require authentication):
 * - /home - Main page with video carousels
 * - /video/:videoId - Video detail page with player
 * - /profile - User profile
 * - /search - Video search and filtering
 * - /liked - Liked videos
 * - /about - About us
 * - /sitemap - Site map
 * 
 * The root route (/) automatically redirects to /login
 * 
 * @example
 * ```tsx
 * // Usage in main.tsx
 * ReactDOM.createRoot(document.getElementById("root")!).render(
 *   <React.StrictMode>
 *     <App />
 *   </React.StrictMode>
 * );
 * ```
 */
const App: React.FC = () => {
  // Zustand with persist automatically handles state restoration from localStorage
  
  return (
    <BrowserRouter>
      <main className="bg-darkblue min-w-full min-h-screen">
        <Routes>
          {/* Root route redirects to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/forgot-password" 
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            } 
          />
          <Route 
            path="/reset-password/:token" 
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            } 
          />

          {/* Protected routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Layout>
                  <HomePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/video/:videoId"
            element={
              <ProtectedRoute>
                <Layout>
                  <VideoPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Layout>
                  <SearchPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/liked"
            element={
              <ProtectedRoute>
                <Layout>
                  <LikedPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <Layout>
                  <AboutUsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/sitemap"
            element={
              <ProtectedRoute>
                <Layout>
                  <SiteMapPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user-manual"
            element={
              <ProtectedRoute>
                <UserManualPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;
