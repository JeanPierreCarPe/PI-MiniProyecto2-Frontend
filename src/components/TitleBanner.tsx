/**
 * Props for the TitleBanner component
 * @typedef {Object} TitleBannerProps
 * @property {string} title - Title to display in the banner
 * @property {Function} [onViewMore] - Optional callback executed when clicking "See more"
 */
interface TitleBannerProps {
  title: string;
  onViewMore?: () => void;
}

/**
 * Title banner with optional "See more" button
 * Primarily used as header for video carousels
 * 
 * @component
 * @param {TitleBannerProps} props - Component props
 * @returns {JSX.Element} Rendered title banner
 * 
 * @example
 * ```tsx
 * // With "See more" button
 * <TitleBanner 
 *   title="Popular Videos" 
 *   onViewMore={() => navigate('/search?category=popular')}
 * />
 * ```
 * 
 * @example
 * ```tsx
 * // Without "See more" button
 * <TitleBanner title="My Favorite Videos" />
 * ```
 */
const TitleBanner: React.FC<TitleBannerProps> = ({ title, onViewMore }) => {
  return (
    <>
      <div className="w-full h-16 flex items-center justify-between bg-white/5 p-5 rounded-lg">
        <h2 className="font-semibold text-white text-xl md:text-3xl">{title}</h2>
        {onViewMore && (
          <button
            onClick={onViewMore}
            className="back-button flex text-white cursor-pointer gap-2 hover:text-green transition"
          >
            <p>Ver mas</p>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M5 12l14 0" />
              <path d="M15 16l4 -4" />
              <path d="M15 8l4 4" />
            </svg>
          </button>
        )}
      </div>
    </>
  );
};

export default TitleBanner;
