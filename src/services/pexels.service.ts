/**
 * Service to interact with backend API to get videos
 * Backend handles communication with Pexels
 */

import type {
  PexelsVideo,
  PexelsVideoSearchResponse,
  PexelsPopularVideosResponse,
  Comment,
} from "../types/pexels.types";

// Backend URL
const BACKEND_API_URL = import.meta.env.VITE_BACKEND_URL || "https://oscarrrrrrrr0304-pi-miniproyecto2-backend.onrender.com/api";

/**
 * Common headers for all backend requests
 */
const getBackendHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

/**
 * Pexels service for videos
 */
export const pexelsService = {
  /**
   * Get a specific video by ID from backend
   * @param id - Pexels video ID
   * @returns Pexels video
   */
  async getVideoById(id: string): Promise<PexelsVideo> {
    const response = await fetch(`${BACKEND_API_URL}/videos/${id}`, {
      headers: getBackendHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error getting video: ${response.statusText}`);
    }

    const data = await response.json();
    // Backend returns { video: {...} }
    return data.video;
  },

  /**
   * Search videos by query (currently uses popular videos from backend)
   * @param query - Search term (not used for now)
   * @param page - Page number (default: 1)
   * @param perPage - Videos per page (default: 15, max: 80)
   * @returns Response with video list
   */
  async searchVideos(
    query: string,
    page: number = 1,
    perPage: number = 15
  ): Promise<PexelsVideoSearchResponse> {
    // Keep parameters for compatibility even if not used for now
    console.log(`Search requested: "${query}", page: ${page}`);
    
    // For now we use the popular videos endpoint
    // TODO: When backend implements search, update this method
    const response = await fetch(
      `${BACKEND_API_URL}/videos/popular?limit=${perPage}`,
      {
        headers: getBackendHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Error searching videos: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Backend might return { videos: [...] } or directly the array
    if (data.videos && Array.isArray(data.videos)) {
      return {
        page: 1,
        per_page: perPage,
        total_results: data.videos.length,
        url: "",
        videos: data.videos
      };
    }
    
    return data;
  },

  /**
   * Get popular videos from backend
   * @param page - Page number (default: 1) - not used for now
   * @param perPage - Videos per page (default: 15, max: 80)
   * @returns Response with popular videos list
   */
  async getPopularVideos(
    page: number = 1,
    perPage: number = 15
  ): Promise<PexelsPopularVideosResponse> {
    // Mantener parámetro page para compatibilidad aunque no se use por ahora
    console.log(`Página solicitada: ${page}`);
    
    const response = await fetch(
      `${BACKEND_API_URL}/videos/popular?limit=${perPage}`,
      {
        headers: getBackendHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener videos populares: ${response.statusText}`);
    }

    const data = await response.json();
    
    // El backend podría devolver { videos: [...] } o directamente el array
    // Ajustamos según la estructura real del backend
    if (data.videos && Array.isArray(data.videos)) {
      return {
        page: 1,
        per_page: perPage,
        total_results: data.videos.length,
        url: "",
        videos: data.videos
      };
    }
    
    // If it's already the expected format, return as is
    return data;
  },

  /**
   * Get video URL in HD quality
   * @param video - Pexels video
   * @returns HD video URL or first available
   */
  getVideoHDUrl(video: PexelsVideo): string {
    // Check if video files exist
    if (!video.video_files || video.video_files.length === 0) {
      return "";
    }

    // Look for video in HD quality
    const hdVideo = video.video_files.find((file) => file.quality === "hd");
    if (hdVideo) return hdVideo.link;

    // If no HD, return first available video
    return video.video_files[0]?.link || "";
  },

  /**
   * Get video URL in SD quality
   * @param video - Pexels video
   * @returns SD video URL or first available
   */
  getVideoSDUrl(video: PexelsVideo): string {
    // Check if video files exist
    if (!video.video_files || video.video_files.length === 0) {
      return "";
    }

    // Look for video in SD quality
    const sdVideo = video.video_files.find((file) => file.quality === "sd");
    if (sdVideo) return sdVideo.link;

    // If no SD, return first available video
    return video.video_files[0]?.link || "";
  },

  /**
   * Like/unlike a video (toggle)
   * Backend automatically detects whether to add or remove like
   * If user already liked it, removes it. If not, adds it.
   * @async
   * @param {string} videoId - Video ID
   * @returns {Promise<{message: string, likesCount: number, liked: boolean}>} Confirmation, count and like status
   * @throws {Error} If user is not authenticated or server error
   * @example
   * const result = await pexelsService.toggleLikeVideo('507f1f77bcf86cd799439011');
   * console.log(result.liked); // true or false
   * console.log(result.likesCount); // 42
   */
  async toggleLikeVideo(videoId: string): Promise<{ message: string; likesCount: number; liked: boolean }> {
    const response = await fetch(
      `${BACKEND_API_URL}/videos/${videoId}/like`,
      {
        method: "POST",
        headers: getBackendHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error del backend al dar/quitar like:', errorText);
      throw new Error(`Error al procesar like (${response.status}): ${errorText}`);
    }

    return response.json();
  },

  /**
   * Submits a rating for a video
   * Sends user rating from 1 to 5 stars
   * 
   * @param {string} videoId - MongoDB ID of the video to rate
   * @param {number} rating - Rating value from 1 to 5
   * @returns {Promise<{ message: string; averageRating: number; totalRatings: number }>} Rating result
   * @throws {Error} If rating is invalid or user is not authenticated
   * @example
   * const result = await pexelsService.rateVideo('507f1f77bcf86cd799439011', 5);
   * console.log(result.averageRating); // 4.5
   * console.log(result.totalRatings); // 120
   */
  async rateVideo(videoId: string, rating: number): Promise<{ message: string; averageRating: number; totalRatings: number }> {
    const response = await fetch(
      `${BACKEND_API_URL}/videos/${videoId}/rating`,
      {
        method: "POST",
        headers: getBackendHeaders(),
        body: JSON.stringify({ rating }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error submitting rating:', errorText);
      throw new Error(`Error submitting rating (${response.status}): ${errorText}`);
    }

    return response.json();
  },

  /**
   * Gets the rating information for a video
   * Returns average rating and total number of ratings
   * 
   * @param {string} videoId - MongoDB ID of the video
   * @returns {Promise<{ averageRating: number; totalRatings: number }>} Rating information
   * @throws {Error} If video is not found or server error
   * @example
   * const rating = await pexelsService.getVideoRating('507f1f77bcf86cd799439011');
   * console.log(rating.averageRating); // 4.5
   * console.log(rating.totalRatings); // 120
   */
  async getVideoRating(videoId: string): Promise<{ averageRating: number; totalRatings: number }> {
    const response = await fetch(
      `${BACKEND_API_URL}/videos/${videoId}/rating`,
      {
        method: "GET",
        headers: getBackendHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error getting rating:', errorText);
      throw new Error(`Error getting rating (${response.status}): ${errorText}`);
    }

    return response.json();
  },

  /**
   * Gets the current user's rating for a video
   * Returns user's own rating if they have rated the video
   * 
   * @param {string} videoId - MongoDB ID of the video
   * @returns {Promise<{ rating: number } | null>} User's rating or null if not rated
   * @throws {Error} If server error
   * @example
   * const userRating = await pexelsService.getUserRating('507f1f77bcf86cd799439011');
   * console.log(userRating?.rating); // 5 or undefined
   */
  async getUserRating(videoId: string): Promise<{ rating: number } | null> {
    try {
      console.log('🔍 Fetching user rating for video:', videoId);
      const response = await fetch(
        `${BACKEND_API_URL}/videos/${videoId}/rating/user`,
        {
          method: "GET",
          headers: getBackendHeaders(),
        }
      );

      console.log('📡 Response status:', response.status);

      if (response.status === 404) {
        // User hasn't rated this video yet
        console.log('✅ User has not rated this video (404 is expected)');
        return null;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend error getting user rating:', errorText);
        throw new Error(`Error getting user rating (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ User rating data received:', data);
      return data;
    } catch (err) {
      console.error('❌ Error fetching user rating:', err);
      // Only return null for 404, throw for other errors
      if (err instanceof Error && err.message.includes('404')) {
        return null;
      }
      return null;
    }
  },

  /**
   * Gets all comments for a video
   * Returns array of comments sorted by date (user's comments first)
   * 
   * @param {string} videoId - MongoDB ID of the video
   * @returns {Promise<Comment[]>} Array of comments
   * @throws {Error} If video is not found or server error
   * @example
   * const comments = await pexelsService.getComments('507f1f77bcf86cd799439011');
   * console.log(comments.length); // 25
   */
  async getComments(videoId: string): Promise<Comment[]> {
    const response = await fetch(
      `${BACKEND_API_URL}/videos/${videoId}/comments`,
      {
        method: "GET",
        headers: getBackendHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error getting comments:', errorText);
      throw new Error(`Error getting comments (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    // Backend returns { comments: [...] }
    return data.comments || [];
  },

  /**
   * Adds a new comment to a video
   * Requires user authentication
   * 
   * @param {string} videoId - MongoDB ID of the video
   * @param {string} text - Comment text content
   * @returns {Promise<Comment>} Created comment with user info
   * @throws {Error} If text is empty or user is not authenticated
   * @example
   * const comment = await pexelsService.addComment('507f1f77bcf86cd799439011', 'Great video!');
   * console.log(comment._id);
   */
  async addComment(videoId: string, text: string): Promise<Comment> {
    const response = await fetch(
      `${BACKEND_API_URL}/videos/${videoId}/comments`,
      {
        method: "POST",
        headers: getBackendHeaders(),
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error adding comment:', errorText);
      throw new Error(`Error adding comment (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    // Backend returns { comment: {...} }
    return data.comment;
  },

  /**
   * Edits an existing comment
   * Only the comment owner can edit
   * 
   * @param {string} videoId - MongoDB ID of the video
   * @param {string} commentId - MongoDB ID of the comment
   * @param {string} text - New comment text
   * @returns {Promise<Comment>} Updated comment
   * @throws {Error} If not authorized or comment not found
   * @example
   * const updated = await pexelsService.editComment('video123', 'comment456', 'Updated text');
   */
  async editComment(videoId: string, commentId: string, text: string): Promise<Comment> {
    const response = await fetch(
      `${BACKEND_API_URL}/videos/${videoId}/comments/${commentId}`,
      {
        method: "PUT",
        headers: getBackendHeaders(),
        body: JSON.stringify({ text }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error editing comment:', errorText);
      throw new Error(`Error editing comment (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    // Backend returns { comment: {...} }
    return data.comment;
  },

  /**
   * Deletes a comment
   * Only the comment owner can delete
   * 
   * @param {string} videoId - MongoDB ID of the video
   * @param {string} commentId - MongoDB ID of the comment
   * @returns {Promise<{ message: string }>} Success message
   * @throws {Error} If not authorized or comment not found
   * @example
   * await pexelsService.deleteComment('video123', 'comment456');
   */
  async deleteComment(videoId: string, commentId: string): Promise<{ message: string }> {
    const response = await fetch(
      `${BACKEND_API_URL}/videos/${videoId}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: getBackendHeaders(),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error deleting comment:', errorText);
      throw new Error(`Error deleting comment (${response.status}): ${errorText}`);
    }

    return response.json();
  },
};
