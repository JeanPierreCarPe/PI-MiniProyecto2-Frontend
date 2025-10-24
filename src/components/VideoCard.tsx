import { useNavigate } from "react-router-dom";
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
 * Clicking the card navigates to the video detail page
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

  /**
   * Handles click event on the card
   * Navigates to the video detail page using its ID
   */
  const handleClick = () => {
    navigate(`/video/${video._id}`);
  };

  return (
    <div
      className="video-card h-64 w-full sm:w-72 md:w-96 md:h-fit flex-shrink-0 flex flex-col items-center gap-2 cursor-pointer"
      onClick={handleClick}
    >
      <img
        src={video.image}
        alt={`Video by ${video.user.name}`}
        className="w-full h-52 object-cover rounded-2xl shadow-lg"
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
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
            </svg>
            <span className="likes-count">0</span>
          </p>
          <p className="video-likes flex items-center gap-1">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-heart stroke-red"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
            </svg>
            <span className="likes-count">{video.likesCount || 0}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
