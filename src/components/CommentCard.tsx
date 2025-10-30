/**
 * Comment card component
 * Displays a single comment with user information and actions
 * 
 * @module CommentCard
 */

import React from "react";

/**
 * Comment interface
 */
interface Comment {
  _id: string;
  userId: string; // ObjectId of the user who posted
  userName: string; // Name of the user
  text: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Props for CommentCard component
 */
interface CommentCardProps {
  /** Comment data to display */
  comment: Comment;
  /** Current user ID to determine ownership */
  currentUserId?: string;
  /** Callback when edit button is clicked */
  onEdit?: (comment: Comment) => void;
  /** Callback when delete button is clicked */
  onDelete?: (commentId: string) => void;
  /** Whether actions are being processed */
  isProcessing?: boolean;
}

/**
 * CommentCard component
 * Displays comment with author info, text, and date
 * Shows edit/delete buttons only for user's own comments
 * 
 * @component
 * @param {CommentCardProps} props - Component props
 * @returns {JSX.Element} Comment card
 * 
 * @example
 * ```tsx
 * <CommentCard
 *   comment={comment}
 *   currentUserId={user.id}
 *   onEdit={(comment) => handleEdit(comment)}
 *   onDelete={(id) => handleDelete(id)}
 * />
 * ```
 */
const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  isProcessing = false,
}) => {
  const isOwner = currentUserId === comment.userId;
  
  /**
   * Formats date to relative time (e.g., "hace 2 horas")
   * 
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted relative time
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffSecs < 60) return 'hace unos segundos';
    if (diffMins < 60) return `hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
    if (diffHours < 24) return `hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    if (diffDays < 7) return `hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`bg-white/5 rounded-lg p-4 border ${isOwner ? 'border-green/50' : 'border-white/10'}`}>
      {/* Header: User info and actions */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 bg-blue rounded-full flex items-center justify-center text-white font-semibold">
            {comment.userName.charAt(0).toUpperCase()}
          </div>
          
          {/* User name and date */}
          <div>
            <div className="flex items-center gap-2">
              <p className="text-white font-semibold">{comment.userName}</p>
              {isOwner && (
                <span className="px-2 py-0.5 bg-green/20 text-green text-xs rounded-full">
                  Tú
                </span>
              )}
            </div>
            <p className="text-white/60 text-sm">
              {formatDate(comment.createdAt)}
              {comment.updatedAt && comment.updatedAt !== comment.createdAt && (
                <span className="ml-1 italic">(editado)</span>
              )}
            </p>
          </div>
        </div>

        {/* Action buttons (only for owner) */}
        {isOwner && (onEdit || onDelete) && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(comment)}
                disabled={isProcessing}
                className="p-2 hover:bg-white/10 rounded transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Editar comentario"
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
                  className="text-white/80"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                  <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                  <path d="M16 5l3 3" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(comment._id)}
                disabled={isProcessing}
                className="p-2 hover:bg-red/20 rounded transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                title="Eliminar comentario"
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
                  className="text-red"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M4 7l16 0" />
                  <path d="M10 11l0 6" />
                  <path d="M14 11l0 6" />
                  <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                  <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Comment text */}
      <p className="text-white/90 leading-relaxed whitespace-pre-wrap break-words">
        {comment.text}
      </p>
    </div>
  );
};

export default CommentCard;
