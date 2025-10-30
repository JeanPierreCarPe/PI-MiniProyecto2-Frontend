import { Link, useNavigate, useLocation } from "react-router";

/**
 * Responsive navigation bar component
 * Mobile: top bar with logo and back button + bottom bar with navigation
 * Desktop/Tablet: single top bar with centered logo and navigation on the right
 *
 * @component
 * @returns {JSX.Element} Adaptive navigation bar
 *
 * @example
 * ```tsx
 * <Navbar />
 * ```
 *
 * @description
 * Features:
 * - Responsive navigation (mobile and desktop)
 * - "Back" button that appears on all pages except Home
 * - Links to: Home, Search, Liked, Profile
 * - Centered logo
 * - Fixed positioning (top on desktop, top + bottom on mobile)
 */
const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/home";

  /**
   * Navigates to the previous page in browser history
   */
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <>
      <nav className="md:hidden w-full fixed top-0 left-0 h-20 flex items-center justify-between bg-darkblue px-4 z-[1000]">
        {!isHomePage ? (
          <button
            onClick={handleGoBack}
            className="back-button flex text-white cursor-pointer gap-2 hover:text-green transition focus:outline-none focus:ring-2 focus:ring-green rounded px-2 py-1"
            aria-label="Volver a la página anterior"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-left"
              aria-hidden="true"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 12l14 0" />
              <path d="M5 12l4 4" />
              <path d="M5 12l4 -4" />
            </svg>
            <p>Volver</p>
          </button>
        ) : (
          <div className="w-20"></div>
        )}
        <img
          src="/images/logo.png"
          alt="Logo de Video Platform"
          className="w-16 h-16 object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        <div className="w-16"></div>
      </nav>
      <nav className="md:hidden w-full fixed bottom-0 left-0 h-20 bg-darkblue border-t z-[1000]">
        <div className="nav-options flex justify-around items-center h-full">
          <Link
            to="/home"
            className="flex flex-col justify-center items-center text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green rounded transition"
            aria-label="Ir a la página principal"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-home hover:stroke-green transition"
              aria-hidden="true"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
              <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
              <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
            </svg>
            <p className="text-xs mt-1">Home</p>
          </Link>
          <Link
            to="/search"
            className="flex flex-col justify-center items-center text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green rounded transition"
            aria-label="Ir a búsqueda de videos"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-search hover:stroke-green transition"
              aria-hidden="true"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
              <path d="M21 21l-6 -6" />
            </svg>
            <p className="text-xs mt-1">Search</p>
          </Link>
          <Link
            to="/liked"
            className="flex flex-col justify-center items-center text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green rounded transition"
            aria-label="Ir a mis videos favoritos"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-heart hover:stroke-green transition"
              aria-hidden="true"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
            </svg>
            <p className="text-xs mt-1">Favoritos</p>
          </Link>
          <Link
            to="/profile"
            className="flex flex-col justify-center items-center text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green rounded transition"
            aria-label="Ir a mi perfil"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-user hover:stroke-green transition"
              aria-hidden="true"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
              <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
            </svg>
            <p className="text-xs mt-1">Profile</p>
          </Link>
        </div>
      </nav>

      {/* DESKTOP/TABLET: Single bar */}
      <nav className="hidden md:flex w-full fixed top-0 left-0 h-20 items-center justify-between bg-darkblue px-8 z-[1000]">
        {!isHomePage ? (
          <button
            onClick={handleGoBack}
            className="back-button flex text-white cursor-pointer gap-2 hover:text-green transition focus:outline-none focus:ring-2 focus:ring-green rounded px-2 py-1"
            aria-label="Volver a la página anterior"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-left"
              aria-hidden="true"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 12l14 0" />
              <path d="M5 12l4 4" />
              <path d="M5 12l4 -4" />
            </svg>
            <p>Volver</p>
          </button>
        ) : (
          <div className="w-24"></div>
        )}
        <img
          src="/images/logo.png"
          alt="Logo de Video Platform"
          className="w-16 h-16 object-contain absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
        <div className="nav-options flex">
          <Link
            to="/home"
            className="flex flex-col justify-center items-center text-white px-4 focus:outline-none focus:ring-2 focus:ring-green rounded transition"
            aria-label="Ir a la página principal"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-home hover:stroke-green transition"
              aria-hidden="true"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
              <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
              <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
            </svg>
          </Link>
          <Link
            to="/search"
            className="flex flex-col justify-center items-center text-white px-4 focus:outline-none focus:ring-2 focus:ring-green rounded transition"
            aria-label="Ir a búsqueda de videos"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-search hover:stroke-green transition"
              aria-hidden="true"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
              <path d="M21 21l-6 -6" />
            </svg>
          </Link>
          <Link
            to="/liked"
            className="flex flex-col justify-center items-center text-white px-4 focus:outline-none focus:ring-2 focus:ring-green rounded transition"
            aria-label="Ir a mis videos favoritos"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-heart hover:stroke-green transition"
              aria-hidden="true"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
            </svg>
          </Link>
          <Link
            to="/profile"
            className="flex flex-col justify-center items-center text-white px-4 focus:outline-none focus:ring-2 focus:ring-green rounded transition"
            aria-label="Ir a mi perfil"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-user hover:stroke-green transition"
              aria-hidden="true"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
              <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
            </svg>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
