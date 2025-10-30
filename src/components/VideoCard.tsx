import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useUserStore from "../stores/useUserStore";
import { pexelsService } from "../services/pexels.service";
import type { PexelsVideo } from "../types/pexels.types";

/**
 * Props for the VideoCard component
 * @typedef {Object} VideoCardProps
 * @property {PexelsVideo} video - Pexels video object with all video information
 */
interface VideoCardProps {
  video: PexelsVideo;
}

/**
 * Component that displays a video card with basic information
 * Includes preview image, author, duration, and interaction metrics
 * Clicking the image navigates to the video detail page
 * Clicking the heart toggles like/unlike
 * 
 * @component
 * @param {VideoCardProps} props - Component props
 * @returns {JSX.Element} Rendered video card
 * 
 * @example
 * ```tsx
 * <VideoCard video={pexelsVideo} />
 * ```
 */
const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const navigate = useNavigate();
  const { user, updateMoviesLiked } = useUserStore();
  const [isLiking, setIsLiking] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likesCount || 0);
  const [hasLiked, setHasLiked] = useState(
    user?.moviesLiked?.includes(video._id) || false
  );

  /**
   * Handles click event on the image
   * Navigates to the video detail page using its ID
   */
  const handleImageClick = () => {
    navigate(`/video/${video._id}`);
  };

  /**
   * Handles keyboard navigation on the image
   * Activates on Enter or Space key
   */
  const handleImageKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleImageClick();
    }
  };

  /**
   * Handles toggle like/unlike on the heart icon
   * Updates local state and synchronizes with backend
   */
  const handleToggleLike = async (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation(); // Prevent navigation when clicking heart
    
    if (!user || isLiking) return;

    try {
      setIsLiking(true);
      
      // Call backend to toggle like
      const result = await pexelsService.toggleLikeVideo(video._id);
      
      // Update local state
      setHasLiked(result.liked);
      setLikesCount(result.likesCount);
      
      // Update global store
      const updatedMoviesLiked = result.liked
        ? [...(user.moviesLiked || []), video._id]
        : (user.moviesLiked || []).filter(id => id !== video._id);
      
      updateMoviesLiked(updatedMoviesLiked);
      
    } catch (err) {
      console.error("Error toggling like:", err);
    } finally {
      setIsLiking(false);
    }
  };

  /**
   * Handles keyboard activation for the like button
   * Activates on Enter or Space key
   */
  const handleLikeKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggleLike(e);
    }
  };

  return (
    <div className="video-card h-64 w-full sm:w-72 md:w-96 md:h-fit flex-shrink-0 flex flex-col items-center gap-2">
      {/* Image - clickable and keyboard accessible to navigate */}
      <img
        src={video.image}
        alt={`Video by ${video.user.name}. Press Enter to view details.`}
        className="w-full h-52 object-cover rounded-2xl shadow-lg cursor-pointer focus:outline-none focus:ring-4 focus:ring-lightblue transition-all"
        onClick={handleImageClick}
        onKeyDown={handleImageKeyDown}
        tabIndex={0}
        role="button"
        aria-label={`Ver video de ${video.user.name}`}
      />
      <div className="w-full flex justify-between items-center text-white">
        <p className="video-author truncate">{video.user.name}</p>
        <div className="metrics-container flex items-center gap-4">
          <p className="video-duration flex items-center gap-1">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-clock stroke-white"
              aria-hidden="true"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
              <path d="M12 7v5l3 3" />
            </svg>
            <span className="duration">{video.duration}s</span>
          </p>
          <p className="video-rate flex items-center gap-1">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-star stroke-yellow"
              aria-hidden="true"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
            </svg>
            <span className="rating">
              {video.averageRating && video.averageRating > 0 
                ? video.averageRating.toFixed(1) 
                : '0.0'}
            </span>
          </p>
          {/* Heart - clickable and keyboard accessible to toggle like */}
          <button
            onClick={handleToggleLike}
            onKeyDown={handleLikeKeyDown}
            disabled={isLiking || !user}
            className="video-likes flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-transparent border-none p-0 focus:outline-none focus:ring-2 focus:ring-red rounded transition-all"
            title={hasLiked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            aria-label={hasLiked ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            aria-pressed={hasLiked}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={hasLiked ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`icon icon-tabler icons-tabler-outline icon-tabler-heart ${
                hasLiked ? 'stroke-red fill-red' : 'stroke-red'
              }`}
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
            </svg>
            <span className="likes-count">{likesCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
