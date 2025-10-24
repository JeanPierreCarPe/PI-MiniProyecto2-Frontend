/**
 * Site map page
 * Shows the complete navigation structure of the application
 * 
 * @module SiteMapPage
 */

import { Link } from "react-router-dom";

/**
 * Sitemap page component
 * Presents all available routes organized by categories
 * 
 * @component
 * @returns {JSX.Element} Page with site map
 * 
 * @description
 * Features:
 * - Responsive grid layout
 * - Sections organized by functionality
 * - Functional links to all pages
 * - Hover effects on links
 * - Card design for each section
 * 
 * Included sections:
 * - Authentication (Login, Register, Forgot Password)
 * - Main Navigation (Home, Search, My Likes)
 * - User (Profile)
 * - Content (Video Player)
 * - Information (About Us, Site Map)
 * 
 * @example
 * ```tsx
 * <ProtectedRoute>
 *   <Layout>
 *     <SiteMapPage />
 *   </Layout>
 * </ProtectedRoute>
 * ```
 */
const SiteMapPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-darkblue text-white p-8 flex items-center justify-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Mapa del Sitio</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Sección de Autenticación */}
          <div className="bg-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-lightblue">Autenticación</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/login" className="hover:text-lightblue transition-colors">
                  → Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-lightblue transition-colors">
                  → Registrarse
                </Link>
              </li>
              <li>
                <Link to="/forgot-password" className="hover:text-lightblue transition-colors">
                  → Recuperar Contraseña
                </Link>
              </li>
            </ul>
          </div>

          {/* Sección de Navegación Principal */}
          <div className="bg-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-lightblue">Navegación Principal</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/home" className="hover:text-lightblue transition-colors">
                  → Inicio
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-lightblue transition-colors">
                  → Buscar
                </Link>
              </li>
              <li>
                <Link to="/liked" className="hover:text-lightblue transition-colors">
                  → Mis Me Gusta
                </Link>
              </li>
            </ul>
          </div>

          {/* Sección de Usuario */}
          <div className="bg-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-lightblue">Usuario</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className="hover:text-lightblue transition-colors">
                  → Mi Perfil
                </Link>
              </li>
            </ul>
          </div>

          {/* Sección de Contenido */}
          <div className="bg-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-lightblue">Contenido</h2>
            <ul className="space-y-2">
              <li>
                <span className="text-gray-400">
                  → Reproductor de Video
                </span>
                <span className="text-sm text-gray-500 block ml-4">
                  (Se accede desde cualquier video)
                </span>
              </li>
            </ul>
          </div>

          {/* Sección de Información */}
          <div className="bg-white/10 rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-lightblue">Información</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-lightblue transition-colors">
                  → Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/sitemap" className="hover:text-lightblue transition-colors">
                  → Mapa del Sitio
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteMapPage;
