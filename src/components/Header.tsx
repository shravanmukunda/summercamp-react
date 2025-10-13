import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import type { ComponentWithClassName } from '../types';

interface HeaderProps extends ComponentWithClassName {}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [lastScrollY, setLastScrollY] = useState<number>(0);

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  useEffect(() => {
    const handleScroll = (): void => {
      const currentScrollY = window.scrollY;
      
      // Show header when scrolling up or at the top
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Hide header when scrolling down and past 100px
        setIsVisible(false);
        // Close mobile menu when hiding header
        setIsMobileMenuOpen(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <header className={`bg-white fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    } ${className}`}>
      <nav className="flex items-center justify-between px-4 py-3">
        {/* Logo / Brand (optional placeholder) */}
        <Link to="/" className="text-xl font-bold text-gray-800">
          <img src="/image.svg" alt="Logo" className="w-40 h-20 hover:scale-105 transition-transform duration-200" />
        </Link>

        {/* CTA Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/contact"
            className="bg-white text-blue-600 border-2 border-blue-600 px-5 py-2 rounded-lg font-medium hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700 transition-all duration-200"
          >
            Contact Us
          </Link>
          <Link
            to="https://docs.google.com/forms/d/e/1FAIpQLSdUoUK7aMFgG6Ik0J63KndPcw9-KZe_Apv988v1tQP93ox0Fw/viewform?usp=header"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            List Your Academy
          </Link>
          <Link
            to="/packages"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Pricing
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
              to="https://docs.google.com/forms/d/e/1FAIpQLSdUoUK7aMFgG6Ik0J63KndPcw9-KZe_Apv988v1tQP93ox0Fw/viewform"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md mx-2 mt-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              List Your Academy
            </Link>
            <Link
              to="/packages"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-lg text-center font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md mx-2 mt-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;