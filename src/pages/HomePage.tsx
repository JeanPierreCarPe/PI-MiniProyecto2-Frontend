/**
 * Main application page (Home)
 * Displays multiple video carousels organized by categories
 * 
 * @module HomePage
 */

import { Link } from "react-router-dom";
import VideosCarousel from "../components/VideosCarousel";

/**
 * Main page component
 * Renders video carousels by category
 * 
 * @component
 * @returns {JSX.Element} Home page with video carousels
 * 
 * @description
 * Main features:
 * - 8 video categories: Popular, Entertainment, Travel, Music, Fashion, Games, Technology, Sports
 * - Each category has its own horizontal carousel
 * - Clicking on a video navigates to the video detail page
 * - Footer with links to About Us and Site Map
 * - Responsive design with adaptive padding and spacing
 * 
 * @example
 * ```tsx
 * // Usage in App.tsx
 * <ProtectedRoute>
 *   <Layout>
 *     <HomePage />
 *   </Layout>
 * </ProtectedRoute>
 * ```
 */
const HomePage: React.FC = () => {

  /**
   * Video categories configuration
   * @constant {Array<{title: string, category?: string, isPopular?: boolean}>}
   */
  const categories = [
    { title: "Videos Populares", isPopular: true },
    { title: "Entretenimiento", category: "entertainment" },
    { title: "Viajes", category: "travel" },
    { title: "Música", category: "music" },
    { title: "Moda", category: "fashion" },
    { title: "Videojuegos", category: "games" },
    { title: "Tecnología", category: "technology" },
    { title: "Deportes", category: "sports" },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen mt-20 px-4 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col justify-center items-center my-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
          Explora Videos
        </h1>
        <p className="text-white/70 text-lg">
          Descubre contenido de todas las categorías
        </p>
      </div>

      {/* Carruseles de Categorías */}
      <div className="flex flex-col gap-12 mb-8">
        {categories.map((cat, index) => (
          <VideosCarousel
            key={index}
            title={cat.title}
            category={cat.category}
            isPopular={cat.isPopular}
            perPage={12}
          />
        ))}
      </div>

      {/* Footer */}
      <footer className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-8 flex-wrap">
            <Link
              to="/about"
              className="text-white hover:text-green transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-lightblue rounded px-2 py-1"
              aria-label="Ir a página Sobre Nosotros"
            >
              Sobre Nosotros
            </Link>
            <span className="text-white/30">|</span>
            <Link
              to="/sitemap"
              className="text-white hover:text-green transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-lightblue rounded px-2 py-1"
              aria-label="Ir a Mapa del Sitio"
            >
              Mapa del Sitio
            </Link>
            <span className="text-white/30">|</span>
            <Link
              to="/user-manual"
              className="text-white hover:text-green transition-colors text-lg focus:outline-none focus:ring-2 focus:ring-green rounded px-2 py-1 flex items-center gap-2"
              aria-label="Ir a Manual de Usuario"
            >
              Manual de Usuario
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
