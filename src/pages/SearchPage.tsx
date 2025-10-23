import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import VideoPlayerModal from "../components/VideoPlayerModal";
import { pexelsService } from "../services/pexels.service";
import type { PexelsVideo } from "../types/pexels.types";

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeFilter = searchParams.get("category") || "";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState<PexelsVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<PexelsVideo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const observer = useRef<IntersectionObserver | null>(null);
  const lastVideoElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  useEffect(() => {
    // Scroll al inicio de la página cuando cambia el filtro
    window.scrollTo(0, 0);
    
    // Reset cuando cambia el filtro
    setVideos([]);
    setPage(1);
    setHasMore(true);
    setError(null);
  }, [activeFilter]);

  useEffect(() => {
    loadVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeFilter, page]);

  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      // Si no hay filtro activo, mostrar videos populares
      if (!activeFilter || activeFilter === 'popular') {
        response = await pexelsService.getPopularVideos(page, 15);
      } else {
        response = await pexelsService.searchVideos(activeFilter, page, 15);
      }

      if (response.videos.length === 0) {
        setHasMore(false);
      } else {
        setVideos((prev) => [...prev, ...response.videos]);
      }
    } catch (err) {
      console.error("Error al cargar videos:", err);
      setError("Error al cargar videos");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (video: PexelsVideo) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ category: searchQuery.trim() }, { replace: true });
      setSearchQuery("");
    }
  };

  const handleRemoveFilter = () => {
    navigate('/search');
  };

  const getFilterLabel = () => {
    if (!activeFilter) return null;
    if (activeFilter === 'popular') return 'Populares';
    return activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1);
  };

  return (
    <div className="flex flex-col w-full min-h-screen mt-20 px-4">
      {/* Search Bar */}
      <div className="w-full max-w-4xl mx-auto my-8">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar videos por categoría, tema, etc..."
            className="w-full px-6 py-4 bg-white/5 border-2 border-blue text-white rounded-lg focus:outline-none focus:border-lightblue transition placeholder-white/50"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 text-white rounded "
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
              className=" hover:stroke-lightblue transition"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
              <path d="M21 21l-6 -6" />
            </svg>
          </button>
        </form>
      </div>

      {/* Active Filter */}
      {activeFilter && (
        <div className="w-full max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-2">
            <span className="text-white/70">Filtro activo:</span>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue/20 border border-blue rounded-lg">
              <span className="text-white font-semibold">{getFilterLabel()}</span>
              <button
                onClick={handleRemoveFilter}
                className="text-white hover:text-red transition"
                aria-label="Eliminar filtro"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M18 6l-12 12" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Videos Container with Flex Wrap */}
      <div className="flex flex-wrap gap-6 mb-8 justify-center">
        {videos.map((video, index) => {
          if (videos.length === index + 1) {
            return (
              <div key={video.id} ref={lastVideoElementRef}>
                <VideoCard video={video} onVideoClick={handleVideoClick} />
              </div>
            );
          } else {
            return (
              <VideoCard
                key={video.id}
                video={video}
                onVideoClick={handleVideoClick}
              />
            );
          }
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-white text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-lightblue"></div>
          <p className="mt-4">Cargando más videos...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-red text-center py-8">
          <p>{error}</p>
          <button
            onClick={() => loadVideos()}
            className="mt-4 px-6 py-2 bg-blue text-white rounded hover:bg-lightblue transition"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* No More Videos */}
      {!hasMore && videos.length > 0 && (
        <div className="text-white/70 text-center py-8">
          No hay más videos para mostrar
        </div>
      )}

      {/* No Videos Found */}
      {!loading && videos.length === 0 && !error && (
        <div className="text-white/70 text-center py-8 text-xl">
          No se encontraron videos en esta categoría
        </div>
      )}

      {/* Video Player Modal */}
      <VideoPlayerModal
        video={selectedVideo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default SearchPage;