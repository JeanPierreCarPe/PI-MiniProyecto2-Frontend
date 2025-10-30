/**
 * Video playback page
 * Displays the player, video information and related videos
 * 
 * @module VideoPage
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VideosCarousel from "../components/VideosCarousel";
import RatingModal from "../components/RatingModal";
import RatingStatsModal from "../components/RatingStatsModal";
import CommentCard from "../components/CommentCard";
import CommentModal from "../components/CommentModal";
import DeleteCommentModal from "../components/DeleteCommentModal";
import useUserStore from "../stores/useUserStore";
import { pexelsService } from "../services/pexels.service";
import type { PexelsVideo, Comment } from "../types/pexels.types";

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
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [ratingStats, setRatingStats] = useState<{
    averageRating: number;
    totalRatings: number;
    ratings: Array<{
      userId: string;
      rating: number;
      createdAt: string;
    }>;
  } | null>(null);
  const [isDeletingRating, setIsDeletingRating] = useState(false);
  
  // Comments states
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [displayedComments, setDisplayedComments] = useState(3);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [isCommentProcessing, setIsCommentProcessing] = useState(false);

  /**
   * Loads comments for the video
   * Sorts to show user's comments first
   * 
   * @async
   * @param {string} id - Video ID
   */
  const loadComments = useCallback(async (id: string) => {
    try {
      setLoadingComments(true);
      console.log('Loading comments for video:', id);
      const fetchedComments = await pexelsService.getComments(id);
      console.log('Comments fetched from backend:', fetchedComments);
      
      // Sort comments: user's comments first, then by date
      const sortedComments = [...fetchedComments].sort((a, b) => {
        // User's comments first (use userId from backend)
        if (user && a.userId === user.id && b.userId !== user.id) return -1;
        if (user && b.userId === user.id && a.userId !== user.id) return 1;
        
        // Then sort by date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      console.log('Comments sorted and ready to display:', sortedComments.length);
      setComments(sortedComments);
    } catch (err) {
      console.error("Error loading comments:", err);
    } finally {
      setLoadingComments(false);
    }
  }, [user]);

  /**
   * Effect: Loads video when videoId changes
   * Extracts a tag to show related videos
   * Checks if user already liked this video
   */
  useEffect(() => {
    if (videoId) {
      loadVideo(videoId);
      loadComments(videoId);
    }
    
    // Scroll to top when loading page
    window.scrollTo(0, 0);
  }, [videoId, loadComments]);
  
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
   * Also loads rating information and detects user's rating
   * 
   * @async
   * @param {string} id - Pexels video ID
   */
  const loadVideo = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const videoData = await pexelsService.getVideoById(id);
      
      // Load rating statistics to get both average and user's rating
      if (user) {
        try {
          const stats = await pexelsService.getRatingStats(id);
          videoData.averageRating = stats.averageRating;
          videoData.totalRatings = stats.totalRatings;
          
          // Check if user has rated this video
          const userRatingData = stats.ratings.find(r => r.userId === user.id);
          if (userRatingData) {
            console.log('User rating found:', userRatingData.rating);
            setUserRating(userRatingData.rating);
          } else {
            console.log('No user rating found');
            setUserRating(null);
          }
        } catch (error) {
          console.log('No rating data available for this video:', error);
          videoData.averageRating = 0;
          videoData.totalRatings = 0;
          setUserRating(null);
        }
      } else {
        // If no user is logged in, just load basic rating info
        try {
          const ratingData = await pexelsService.getVideoRating(id);
          videoData.averageRating = ratingData.averageRating;
          videoData.totalRatings = ratingData.totalRatings;
        } catch {
          videoData.averageRating = 0;
          videoData.totalRatings = 0;
        }
        console.log('No user authenticated, skipping user rating check');
        setUserRating(null);
      }
      
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

  /**
   * Handles video rating submission
   * Sends rating to backend and updates video rating display
   * 
   * @async
   * @param {number} rating - Rating value from 1 to 5
   */
  const handleRating = async (rating: number) => {
    if (!videoId || isRating) return;

    try {
      setIsRating(true);
      
      console.log('Submitting rating:', rating, 'for video:', videoId);
      
      const result = await pexelsService.rateVideo(videoId, rating);
      
      console.log('Rating submitted successfully:', result);
      
      // Update video rating information
      if (video) {
        setVideo({
          ...video,
          averageRating: result.averageRating,
          totalRatings: result.totalRatings
        });
      }
      
      // Update user's rating
      setUserRating(rating);
      
      // Close modal
      setShowRatingModal(false);
      
      // Show success message
      const action = userRating ? 'actualizada' : 'registrada';
      alert(`¡Gracias por calificar! Tu calificación ha sido ${action}. Rating promedio: ${result.averageRating.toFixed(1)}/5`);
      
    } catch (err) {
      console.error("Error submitting rating:", err);
      alert(`Error: ${err instanceof Error ? err.message : 'Could not submit rating'}`);
    } finally {
      setIsRating(false);
    }
  };

  /**
   * Loads rating statistics and opens stats modal
   * Fetches detailed ratings list and detects user's rating
   * 
   * @async
   */
  const handleOpenStatsModal = async () => {
    if (!videoId) return;

    try {
      console.log('Loading rating statistics for video:', videoId);
      
      const stats = await pexelsService.getRatingStats(videoId);
      
      console.log('Rating stats loaded:', stats);
      
      // Detect user's rating from the ratings array
      if (user) {
        const userRatingData = stats.ratings.find(r => r.userId === user.id);
        if (userRatingData) {
          console.log('User rating found in stats:', userRatingData.rating);
          setUserRating(userRatingData.rating);
        }
      }
      
      setRatingStats(stats);
      setShowStatsModal(true);
      
    } catch (err) {
      console.error("Error loading rating stats:", err);
      alert(`Error: ${err instanceof Error ? err.message : 'Could not load statistics'}`);
    }
  };

  /**
   * Handles editing user's rating from stats modal
   * Opens rating modal with current rating pre-selected
   */
  const handleEditRatingFromStats = () => {
    setShowStatsModal(false);
    setShowRatingModal(true);
  };

  /**
   * Handles deleting user's rating
   * Removes rating from backend and updates display
   * 
   * @async
   */
  const handleDeleteRating = async () => {
    if (!videoId || isDeletingRating) return;

    try {
      setIsDeletingRating(true);
      
      console.log('Deleting rating for video:', videoId);
      
      const result = await pexelsService.deleteVideoRating(videoId);
      
      console.log('Rating deleted successfully:', result);
      
      // Update video rating information
      if (video) {
        setVideo({
          ...video,
          averageRating: result.averageRating,
          totalRatings: result.totalRatings
        });
      }
      
      // Clear user's rating
      setUserRating(null);
      
      // Close stats modal
      setShowStatsModal(false);
      
      // Reload stats if modal is still open
      if (showStatsModal) {
        await handleOpenStatsModal();
      }
      
      alert('Tu calificación ha sido eliminada exitosamente');
      
    } catch (err) {
      console.error("Error deleting rating:", err);
      alert(`Error: ${err instanceof Error ? err.message : 'Could not delete rating'}`);
    } finally {
      setIsDeletingRating(false);
    }
  };

  /**
   * Handles adding a new comment
   * 
   * @async
   * @param {string} text - Comment text
   */
  const handleAddComment = async (text: string) => {
    if (!videoId || isCommentProcessing) return;

    try {
      setIsCommentProcessing(true);
      
      const newComment = await pexelsService.addComment(videoId, text);
      
      console.log('Comment received from backend:', newComment);
      
      // Ensure userId and userName exist (should come from backend)
      if (!newComment.userId && user) {
        newComment.userId = user.id;
        newComment.userName = user.name;
      }
      
      // Add comment to list at the beginning (user's comments first)
      setComments([newComment, ...comments]);
      
      // Close modal
      setShowCommentModal(false);
      
      console.log('Comment added successfully');
      
    } catch (err) {
      console.error("Error adding comment:", err);
      alert(`Error: ${err instanceof Error ? err.message : 'Could not add comment'}`);
    } finally {
      setIsCommentProcessing(false);
    }
  };

  /**
   * Opens edit modal for a comment
   * 
   * @param {Comment} comment - Comment to edit
   */
  const handleEditClick = (comment: Comment) => {
    setEditingComment(comment);
    setShowEditModal(true);
  };

  /**
   * Handles editing an existing comment
   * 
   * @async
   * @param {string} text - New comment text
   */
  const handleEditComment = async (text: string) => {
    if (!videoId || !editingComment || isCommentProcessing) return;

    try {
      setIsCommentProcessing(true);
      
      const updatedComment = await pexelsService.editComment(
        videoId,
        editingComment._id,
        text
      );
      
      console.log('Updated comment from backend:', updatedComment);
      
      // Ensure userId and userName exist
      if (!updatedComment.userId && editingComment.userId) {
        updatedComment.userId = editingComment.userId;
        updatedComment.userName = editingComment.userName;
      }
      
      // Update comment in list
      setComments(comments.map(c => 
        c._id === updatedComment._id ? updatedComment : c
      ));
      
      // Close modal
      setShowEditModal(false);
      setEditingComment(null);
      
      console.log('Comment edited successfully');
      
    } catch (err) {
      console.error("Error editing comment:", err);
      alert(`Error: ${err instanceof Error ? err.message : 'Could not edit comment'}`);
    } finally {
      setIsCommentProcessing(false);
    }
  };

  /**
   * Opens delete confirmation modal
   * 
   * @param {string} commentId - Comment ID to delete
   */
  const handleDeleteClick = (commentId: string) => {
    setDeletingCommentId(commentId);
    setShowDeleteModal(true);
  };

  /**
   * Handles deleting a comment
   * 
   * @async
   */
  const handleDeleteComment = async () => {
    if (!videoId || !deletingCommentId || isCommentProcessing) return;

    try {
      setIsCommentProcessing(true);
      
      await pexelsService.deleteComment(videoId, deletingCommentId);
      
      // Remove comment from list
      setComments(comments.filter(c => c._id !== deletingCommentId));
      
      // Close modal
      setShowDeleteModal(false);
      setDeletingCommentId(null);
      
      console.log('Comment deleted successfully');
      
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert(`Error: ${err instanceof Error ? err.message : 'Could not delete comment'}`);
    } finally {
      setIsCommentProcessing(false);
    }
  };

  /**
   * Toggles between showing 3 comments and all comments
   */
  const handleToggleComments = () => {
    if (displayedComments === 3) {
      // Show all comments
      setDisplayedComments(comments.length);
    } else {
      // Show only 3 comments
      setDisplayedComments(3);
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
          className="px-6 py-2 bg-blue text-white rounded hover:bg-lightblue transition cursor-pointer"
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
                crossOrigin="anonymous"
              >
                {/* Subtítulos en Español */}
                <track
                  kind="subtitles"
                  src="/subtitles/generic-es.vtt"
                  srcLang="es"
                  label="Español"
                  default
                />
                {/* Subtítulos en Inglés */}
                <track
                  kind="subtitles"
                  src="/subtitles/generic-en.vtt"
                  srcLang="en"
                  label="English"
                />
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
                  <span className="text-white font-semibold">
                    {video.totalRatings && video.totalRatings > 0 && (
                      <button
                        onClick={handleOpenStatsModal}
                        className="text-green hover:text-green/80 text-sm mr-2 cursor-pointer transition underline focus:outline-none focus:ring-2 focus:ring-green rounded px-1"
                        aria-label={`Ver ${video.totalRatings} ${video.totalRatings === 1 ? 'calificación' : 'calificaciones'}`}
                      >
                        ({video.totalRatings} {video.totalRatings === 1 ? 'calificación' : 'calificaciones'})
                      </button>
                    )}
                    {video.averageRating && video.averageRating > 0 
                      ? `${video.averageRating.toFixed(1)}/5` 
                      : 'Sin calificaciones'}
                  </span>
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
                    <span>Favoritos</span>
                  </div>
                  <span className="text-white font-semibold">{video.likesCount || 0}</span>
                </div>
              </div>
              
              {/* Like Button (Toggle) */}
              <button
                onClick={handleToggleLike}
                disabled={isLiking}
                className={`w-full mt-4 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  hasLiked
                    ? 'bg-red-dark hover:bg-red-medium text-white'
                    : 'bg-blue-medium hover:bg-blue text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer`}
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
                {isLiking ? 'Procesando...' : hasLiked ? 'Quitar de Favoritos' : 'Agregar a Favoritos'}
              </button>

              {/* Rating Button */}
              <button
                onClick={() => {
                  console.log('Opening rating modal. User rating:', userRating);
                  setShowRatingModal(true);
                }}
                disabled={isLiking || isRating}
                className="w-full mt-3 py-3 bg-green/80 hover:bg-green text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer focus:outline-none focus:ring-2 focus:ring-green"
                aria-label={userRating ? 'Editar tu calificación de este video' : 'Calificar este video'}
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
                  aria-hidden="true"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                </svg>
                {userRating ? 'Editar Calificación' : 'Calificar Video'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Rating Modal */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmit={handleRating}
        isSubmitting={isRating}
        initialRating={userRating || 0}
      />

      {/* Rating Stats Modal */}
      <RatingStatsModal
        isOpen={showStatsModal}
        onClose={() => setShowStatsModal(false)}
        stats={ratingStats}
        onEditRating={handleEditRatingFromStats}
        onDeleteRating={handleDeleteRating}
        isDeleting={isDeletingRating}
      />

      {/* Sección de Comentarios */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10 mb-8">
        {/* Header with title and add button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Comentarios {comments.length > 0 && `(${comments.length})`}
          </h2>
          <button
            onClick={() => setShowCommentModal(true)}
            disabled={isCommentProcessing}
            className="px-4 py-2 bg-blue hover:bg-blue-medium text-white rounded-lg font-semibold transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 5l0 14" />
              <path d="M5 12l14 0" />
            </svg>
            Agregar comentario
          </button>
        </div>

        {/* Debug info */}
        {(() => {
          console.log('Comments section render - Loading:', loadingComments, 'Comments:', comments.length);
          return null;
        })()}

        {/* Comments loading state */}
        {loadingComments && (
          <div className="text-center py-8">
            <div className="text-white/60">Cargando comentarios...</div>
          </div>
        )}

        {/* No comments state */}
        {!loadingComments && comments.length === 0 && (
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
            <p>Aún no hay comentarios. ¡Sé el primero en comentar!</p>
          </div>
        )}

        {/* Comments list */}
        {!loadingComments && comments.length > 0 && (
          <div className="space-y-4">
            {(() => {
              console.log('Rendering comments. Total:', comments.length, 'Displayed:', displayedComments);
              return null;
            })()}
            {comments.slice(0, displayedComments).map((comment) => (
              <CommentCard
                key={comment._id}
                comment={comment}
                currentUserId={user?.id}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
                isProcessing={isCommentProcessing}
              />
            ))}

            {/* Toggle button - Always visible if more than 3 comments */}
            {comments.length > 3 && (
              <div className="text-center pt-4">
                <button
                  onClick={handleToggleComments}
                  className="text-green hover:text-green/80 font-semibold transition cursor-pointer"
                >
                  {displayedComments === 3 
                    ? `Ver todos los comentarios (${comments.length})` 
                    : 'Mostrar menos comentarios'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comment Modals */}
      <CommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        onSubmit={handleAddComment}
        isSubmitting={isCommentProcessing}
      />

      <CommentModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingComment(null);
        }}
        onSubmit={handleEditComment}
        isSubmitting={isCommentProcessing}
        initialText={editingComment?.text || ""}
        title="Editar comentario"
      />

      <DeleteCommentModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingCommentId(null);
        }}
        onConfirm={handleDeleteComment}
        isDeleting={isCommentProcessing}
      />

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
