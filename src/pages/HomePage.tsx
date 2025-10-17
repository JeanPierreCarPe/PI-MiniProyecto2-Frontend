import { Link } from "react-router-dom";

const HomePage: React.FC = () => {

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Contenido principal */}
      <div className="flex-1 flex justify-center items-center">
        <h1 className="text-white text-8xl text-center">Esta es la vista de Home</h1>
      </div>

      {/* Footer */}
      <footer className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center gap-8">
            <Link 
              to="/about" 
              className="text-white hover:text-lightblue transition-colors text-lg"
            >
              Sobre Nosotros
            </Link>
            <span className="text-white/30">|</span>
            <Link 
              to="/sitemap" 
              className="text-white hover:text-lightblue transition-colors text-lg"
            >
              Mapa del Sitio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;