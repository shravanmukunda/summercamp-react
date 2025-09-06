import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import type { ComponentWithClassName } from '../types';

interface HeaderProps extends ComponentWithClassName {}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`bg-white shadow-sm sticky top-0 z-50 ${className}`}>
      <nav className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            FindMyCoach
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                isActive ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'
              }
            >
              Home
            </NavLink>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link
              to="/add-institution"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              List Your Institution
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            type="button"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <NavLink to="/" className="text-gray-700 hover:text-blue-600">Home</NavLink>
              <NavLink to="/music" className="text-gray-700 hover:text-blue-600">Music</NavLink>
              <NavLink to="/art" className="text-gray-700 hover:text-blue-600">Art</NavLink>
              <NavLink to="/tuition" className="text-gray-700 hover:text-blue-600">Tuition</NavLink>
              <NavLink to="/dance" className="text-gray-700 hover:text-blue-600">Dance</NavLink>
              <NavLink to="/contact" className="text-gray-700 hover:text-blue-600">Contact</NavLink>
              <Link to="/add-institution" className="bg-blue-600 text-white px-4 py-2 rounded-md text-center">
                List Your Institution
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
