/**
 * Service to interact with backend API to get videos
 * Backend handles communication with Pexels
 */

import type {
  PexelsVideo,
  PexelsVideoSearchResponse,
  PexelsPopularVideosResponse,
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
};
