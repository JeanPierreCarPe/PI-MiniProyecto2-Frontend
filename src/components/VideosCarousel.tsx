import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VideoCard from "./VideoCard";
import TitleBanner from "./TitleBanner";
import type { PexelsVideo } from "../types/pexels.types";
import { pexelsService } from "../services/pexels.service";

/**
 * Props for the VideosCarousel component
 * @typedef {Object} VideosCarouselProps
 * @property {string} title - Carousel title displayed in the TitleBanner
 * @property {string} [category] - Video category to search (e.g., 'entertainment', 'travel')
 * @property {boolean} [isPopular] - If true, loads popular videos instead of searching by category
 * @property {number} [perPage] - Number of videos to load per page (default: 12)
 */
interface VideosCarouselProps {
  title: string;
  category?: string;
  isPopular?: boolean;
  perPage?: number;
}

/**
 * Horizontal video carousel component
 * Displays a list of videos in carousel format with horizontal scroll
 * Includes a title banner with "See more" button that navigates to search page
 * 
 * @component
 * @param {VideosCarouselProps} props - Component props
 * @returns {JSX.Element} Rendered video carousel
 * 
 * @example
 * ```tsx
 * <VideosCarousel
 *   title="Popular Videos"
 *   isPopular={true}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * <VideosCarousel
 *   title="Entertainment"
 *   category="entertainment"
 *   perPage={15}
 * />
 * ```
 */
const VideosCarousel: React.FC<VideosCarouselProps> = ({
  title,
  category,
  isPopular = false,
  perPage = 12,
}) => {
  const [videos, setVideos] = useState<PexelsVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  /**
   * Handles click on the "See more" button
   * Navigates to the search page with the corresponding category
   */
  const handleViewMore = () => {
    // Redirect to SearchPage with the category
    if (category) {
      navigate(`/search?category=${encodeURIComponent(category)}`);
    } else if (isPopular) {
      navigate('/search?category=popular');
    }
  };

  /**
   * Loads videos from Pexels API
   * Uses getPopularVideos if isPopular is true, or searchVideos with the category
   * @async
   * @throws {Error} If there's an error loading videos
   */
  const loadVideos = async () => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (isPopular) {
        response = await pexelsService.getPopularVideos(1, perPage);
      } else if (category) {
        response = await pexelsService.searchVideos(category, 1, perPage);
      } else {
        throw new Error("A category is required or mark as popular");
      }

      setVideos(response.videos);
    } catch (err) {
      console.error(`Error loading videos from ${title}:`, err);
      setError("Error loading videos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, isPopular]);

  return (
    <div className="videos-list w-full h-fit flex flex-col gap-5">
      {/* Title Banner */}
      <TitleBanner title={title} onViewMore={handleViewMore} />

      {/* Videos Container */}
      <div className="videos-container">
        {loading ? (
          <div className="text-white/70 text-lg py-8">
            Cargando videos de {title.toLowerCase()}...
          </div>
        ) : error ? (
          <div className="text-red text-lg py-8">
            <p>{error}</p>
            <button
              onClick={loadVideos}
              className="mt-4 px-4 py-2 bg-blue text-white text-sm rounded hover:bg-lightblue transition"
            >
              Reintentar
            </button>
          </div>
        ) : videos.length > 0 ? (
          <div
            className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#3b82f6 #1f2937",
            }}
          >
            {videos.map((video) => (
              <VideoCard
                key={video._id}
                video={video}
              />
            ))}
          </div>
        ) : (
          <div className="text-white/70 text-lg py-8">
            No se encontraron videos en esta categoría.
          </div>
        )}
      </div>
    </div>
  );
};

export default VideosCarousel;
