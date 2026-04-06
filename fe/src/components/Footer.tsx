import { Link } from 'react-router-dom';
import type { ComponentWithClassName } from '../types';

interface FooterProps extends ComponentWithClassName {}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  return (
    <footer className={`bg-gray-800 text-white py-8 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-start ml-2 mb-8">
          <Link
            to="/list-your-academy"
            className="inline-block bg-blue-600 text-white font-roboto py-2 px-4 rounded mb-2 hover:bg-blue-700 transition-colors"
          >
            List Your Academy
          </Link>
          <p>Promote your academy — apply to get listed on our directory.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-5">
          <div>
            <h2 className="text-xl mb-2 border-b-2 border-white inline-block">
              Quick Links for Academies
            </h2>
            <ul className="list-none p-0">
              <li className="my-2">
                <Link to="/" className="text-white hover:text-red-200 transition-colors">Home</Link>
              </li>
              <li className="my-2">
                <Link to="/contact" className="text-white hover:text-red-200 transition-colors">Contact</Link>
              </li>
              <li className="my-2">
                <Link to="/list-your-academy" className="text-white hover:text-red-200 transition-colors">
                  List your academy
                </Link>
              </li>
              <li className="my-2">
                <Link to="/" className="text-white hover:text-red-200 transition-colors">Read Our Blog</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-xl mb-2 border-b-2 border-white inline-block">
              Follow Us
            </h2>
            <div className="mt-2">
              <a href="#" className="inline-block mr-2">
                <img src="/facebook.svg" alt="Facebook" className="w-8 hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="inline-block mr-2">
                <img src="/instagram.svg" alt="Instagram" className="w-8 hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="ml-5 mt-8">
          <h1>Best Academies in India</h1>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
  