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
    <header className={`bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50 ${className}`}>
      <nav className="flex items-center justify-between px-4 py-3">
        {/* Logo / Brand (optional placeholder) */}
        <Link to="/" className="text-xl font-bold text-gray-800">
          <img src="/logo.svg" alt="Logo" className="w-30 h-16" />
        </Link>

        {/* CTA Button (Desktop) */}
        <div className="hidden md:block">
          <Link
            to="/add-institution"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            List Your Institution
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle mobile menu"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={
                isMobileMenuOpen
                  ? 'M6 18L18 6M6 6l12 12'
                  : 'M4 6h16M4 12h16M4 18h16'
              }
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 py-4 bg-gray-50">
          <div className="flex flex-col space-y-3">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-white hover:text-blue-600'
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/music"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-white hover:text-blue-600'
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Music
            </NavLink>
            <NavLink
              to="/art"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-white hover:text-blue-600'
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Art
            </NavLink>
            <NavLink
              to="/tuition"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-white hover:text-blue-600'
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tuition
            </NavLink>
            <NavLink
              to="/dance"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-white hover:text-blue-600'
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dance
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-white hover:text-blue-600'
                }`
              }
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </NavLink>
            <Link
              to="/add-institution"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md mx-2 mt-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              List Your Institution
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
