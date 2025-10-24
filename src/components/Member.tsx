/**
 * Props for the Member component
 * @typedef {Object} MemberProps
 * @property {string} name - Team member's full name
 * @property {string} role - Role or position in the team
 * @property {string} image - Path to profile image
 */
interface MemberProps {
  name: string;
  role: string;
  image: string;
}

/**
 * Team member card component
 * Displays photo, name, and role with grayscale hover effect
 * 
 * @component
 * @param {MemberProps} props - Component props
 * @returns {JSX.Element} Rendered member card
 * 
 * @description
 * Features:
 * - Background image with background-image
 * - Default grayscale effect
 * - Hover removes grayscale and adds smooth transition
 * - Responsive with adaptive width
 * - Centered text with visual hierarchy
 * 
 * @example
 * ```tsx
 * <Member
 *   name="Jean Pierre Cardenas"
 *   role="Frontend Developer"
 *   image="./images/team/jean.jpg"
 * />
 * ```
 */
const Member: React.FC<MemberProps> = ({ name, role, image }) => {
  return (
    <div className="member h-fit w-3/4 md:w-1/5 text-white/85 flex flex-col items-center gap-1 grayscale hover:grayscale-0 transition-all duration-300">
      <div
        className="picture w-full h-[320px] bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      ></div>
      <h2 className="font-semibold text-xl text-center">{name}</h2>
      <h3 className="text-white/60 text-sm tracking-wider text-center">{role}</h3>
    </div>
  );
};

export default Member;
