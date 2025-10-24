/**
 * Video playback page
 * Displays the player, video information and related videos
 * 
 * @module VideoPage
 */

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideosCarousel from "../components/VideosCarousel";
import useUserStore from "../stores/useUserStore";
import { pexelsService } from "../services/pexels.service";
import type { PexelsVideo } from "../types/pexels.types";

/**
 * Video playback page component
 * 2-column layout with player, info, like system and related videos
 * 
 * @component
 * @returns {JSX.Element} Video playback page
 * 
 * @description
 * Layout structure:
 * ```
 * ----------------------------
 * | player      | video info |
 * |             | statistics |
 * |             | like button|
 * | comments (future sprint)  |
 * | related videos            |
 * ----------------------------
 * ```
 * 
 * Features:
 * - HTML5 video player with controls
 * - Video information (author, duration, dimensions)
 * - "Like" system with toggle (add/remove)
 * - Synchronization with global favorites state
 * - Real-time likes counter update
 * - Related videos carousel based on tags
 * - Responsive layout (column on mobile, 2 columns on desktop)
 * - Navigation from VideoCard using _id (MongoDB)
 * - Comments planned for future sprint
 * 
 * Managed states:
 * - video: Complete information of current video
 * - loading: Video loading state
 * - error: Error message if loading fails
 * - isLiking: Indicates if a like/unlike is being processed
 * - hasLiked: Indicates if user already liked the video
 * 
 * @example
 * ```tsx
 * // Navigation from VideoCard
 * navigate(`/video/${video._id}`)
 * 
 * // Usage in App.tsx
 * <ProtectedRoute>
 *   <Layout>
 *     <VideoPage />
 *   </Layout>
 * </ProtectedRoute>
 * ```
 */
const VideoPage: React.FC = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const { user, updateMoviesLiked } = useUserStore();
  
  const [video, setVideo] = useState<PexelsVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedTag, setRelatedTag] = useState<string>("");
  const [isLiking, setIsLiking] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  /**
   * Effect: Loads video when videoId changes
   * Extracts a tag to show related videos
   * Checks if user already liked this video
   */
  useEffect(() => {
    if (videoId) {
      loadVideo(videoId);
    }
    
    // Scroll to top when loading page
    window.scrollTo(0, 0);
  }, [videoId]);
  
  /**
   * Effect: Updates like state when moviesLiked changes
   * Runs separately to avoid reloading the video
   */
  useEffect(() => {
    if (videoId && user?.moviesLiked) {
      setHasLiked(user.moviesLiked.includes(videoId));
    }
  }, [videoId, user?.moviesLiked]);

  /**
   * Loads video from Pexels API
   * Extracts first video tag for related videos
   * 
   * @async
   * @param {string} id - Pexels video ID
   */
  const loadVideo = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const videoData = await pexelsService.getVideoById(id);
      setVideo(videoData);
      
      // Extract a tag for related videos
      // Since Pexels doesn't have direct tags, we'll use the URL to extract a keyword
      if (videoData.url) {
        const urlParts = videoData.url.split('/').filter(part => part.length > 0);
        const potentialTag = urlParts[urlParts.length - 1] || "popular";
        setRelatedTag(potentialTag);
      } else {
        // If no URL, use "popular" as default tag
        setRelatedTag("popular");
      }
      
    } catch (err) {
      console.error("Error loading video:", err);
      setError("Could not load video");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles the back button
   * Navigates to previous page in history
   */
  const handleGoBack = () => {
    navigate(-1);
  };

  /**
   * Handles liking/unliking video (toggle)
   * Backend automatically handles whether to add or remove
   * Updates likes counter in real time
   * Synchronizes moviesLiked array with global store
   * 
   * @async
   */
  const handleToggleLike = async () => {
    if (!videoId || isLiking || !user) return;

    try {
      setIsLiking(true);
      
      console.log('Toggle like for video:', videoId, 'Current state:', hasLiked ? 'WITH like' : 'WITHOUT like');
      
      // Backend does automatic toggle with POST
      const result = await pexelsService.toggleLikeVideo(videoId);
      
      console.log('Backend response:', result);
      
      // Update button local state immediately
      setHasLiked(result.liked);
      
      // Update likes counter in video
      if (video) {
        setVideo({
          ...video,
          likesCount: result.likesCount
        });
      }
      
      // Update moviesLiked array in global store (without causing video re-render)
      const updatedMoviesLiked = result.liked
        ? [...(user.moviesLiked || []), videoId] // Add
        : (user.moviesLiked || []).filter(id => id !== videoId); // Remove
      
      updateMoviesLiked(updatedMoviesLiked);
      
      console.log('✓ Like updated -', result.liked ? 'ADDED' : 'REMOVED');
      console.log('New favorites total:', updatedMoviesLiked.length);
      
    } catch (err) {
      console.error("Complete error liking/unliking:", err);
      console.error("Error type:", typeof err);
      console.error("Error message:", err instanceof Error ? err.message : String(err));
      alert(`Error: ${err instanceof Error ? err.message : 'Could not process action'}`);
    } finally {
      setIsLiking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white text-xl">Loading video...</div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-red text-xl">{error || "Video no encontrado"}</div>
        <button
          onClick={handleGoBack}
          className="px-6 py-2 bg-blue text-white rounded hover:bg-lightblue transition"
        >
          Volver
        </button>
      </div>
    );
  }

  // Debug: Ver qué contiene el video
  console.log('Video completo en VideoPage:', video);
  console.log('video_files:', video.video_files);

  const videoUrl = pexelsService.getVideoHDUrl(video);
  console.log('URL del video obtenida:', videoUrl);

  return (
    <div className="flex flex-col w-full min-h-screen mt-20 px-4 pb-8">
      {/* Layout Principal: Reproductor + Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-8">
        {/* Columna Izquierda: Reproductor (2/3 en desktop) */}
        <div className="lg:col-span-2">
          <div className="bg-black rounded-lg overflow-hidden">
            {videoUrl ? (
              <video
                ref={videoRef}
                className="w-full aspect-video"
                controls
                autoPlay
                src={videoUrl}
              >
                Your browser does not support the video element.
              </video>
            ) : (
              <div className="w-full aspect-video flex flex-col items-center justify-center bg-gray-800 text-white">
                <svg
                  className="mb-4"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M15 10l4.553 -2.276a1 1 0 0 1 1.447 .894v6.764a1 1 0 0 1 -1.447 .894l-4.553 -2.276v-4z" />
                  <path d="M3 6m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z" />
                </svg>
                <p className="text-xl mb-2">Video no disponible</p>
                <p className="text-sm text-white/60 max-w-md text-center px-4">
                  El archivo de video no está disponible. El backend necesita incluir los enlaces de video_files.
                </p>
                <a 
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 px-6 py-2 bg-blue text-white rounded hover:bg-lightblue transition"
                >
                  Ver en Pexels
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Información del Video (1/3 en desktop) */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 rounded-lg p-6 border border-white/10">
            <h2 className="text-xl font-semibold text-white mb-4">Información del Video</h2>
            
            {/* Autor */}
            <div className="mb-4">
              <p className="text-white/60 text-sm">Autor</p>
              <a 
                href={video.user.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green hover:underline text-lg"
              >
                {video.user.name}
              </a>
            </div>

            {/* Duración */}
            <div className="mb-4">
              <p className="text-white/60 text-sm">Duración</p>
              <div className="flex items-center gap-2 text-white">
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
                  <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                  <path d="M12 7v5l3 3" />
                </svg>
                <span>{video.duration} segundos</span>
              </div>
            </div>

            {/* Resolución */}
            <div className="mb-4">
              <p className="text-white/60 text-sm">Resolución</p>
              <p className="text-white">{video.width} x {video.height}px</p>
            </div>

            {/* Estadísticas */}
            <div className="border-t border-white/10 pt-4 mt-4">
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/80">
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
                      <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                    </svg>
                    <span>Rating</span>
                  </div>
                  <span className="text-white font-semibold">4.5/5</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white/80">
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
                      <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                    </svg>
                    <span>Me gusta</span>
                  </div>
                  <span className="text-white font-semibold">{video.likesCount || 0}</span>
                </div>
              </div>
              
              {/* Botón de Me Gusta (Toggle) */}
              <button
                onClick={handleToggleLike}
                disabled={isLiking}
                className={`w-full mt-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  hasLiked
                    ? 'bg-red-dark hover:bg-red-medium text-white'
                    : 'bg-blue-medium hover:bg-blue text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={hasLiked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                </svg>
                {isLiking ? 'Procesando...' : hasLiked ? 'Quitar de Me Gusta' : 'Agregar a Me Gusta'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Comentarios (Placeholder para futuro sprint) */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10 mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Comentarios</h2>
        <div className="text-white/60 text-center py-8">
          <svg
            className="mx-auto mb-3"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M3 20l1.3 -3.9a9 8 0 1 1 3.4 2.9l-4.7 1" />
            <path d="M12 12l0 .01" />
            <path d="M8 12l0 .01" />
            <path d="M16 12l0 .01" />
          </svg>
          <p>Los comentarios aun no están disponibles</p>
        </div>
      </div>

      {/* Sección de Videos Relacionados */}
        <VideosCarousel
          title="Videos similares"
          category={relatedTag}
          perPage={12}
        />
    </div>
  );
};

export default VideoPage;
