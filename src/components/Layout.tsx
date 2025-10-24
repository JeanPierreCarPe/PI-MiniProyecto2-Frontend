import type { ReactNode } from "react";
import Navbar from "./Navbar";

/**
 * Props for the Layout component
 * @typedef {Object} LayoutProps
 * @property {ReactNode} children - Page content rendered inside the layout
 */
interface LayoutProps {
  children: ReactNode;
}

/**
 * Main application layout component
 * Includes the navigation bar (Navbar) and page content
 * Used as a wrapper for all protected routes
 * 
 * @component
 * @param {LayoutProps} props - Component props
 * @returns {JSX.Element} Layout with navbar and content
 * 
 * @example
 * ```tsx
 * <Layout>
 *   <HomePage />
 * </Layout>
 * ```
 * 
 * @description
 * This component provides the basic navigation structure
 * for all pages of the authenticated application
 */
const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;