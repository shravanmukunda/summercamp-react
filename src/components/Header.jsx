import { Link, NavLink } from 'react-router-dom';

const Header = () => (
  <header className="bg-white shadow-sm">
    <nav className="container mx-auto flex items-center justify-between py-4 px-4">
      <Link to="/" className="text-2xl font-bold text-blue-600">
        EduConnect
      </Link>

      <ul className="hidden md:flex gap-8 font-medium">
        <NavLink to="/institutions" className="hover:text-blue-600">
          Browse
        </NavLink>
        <NavLink to="/music" className="hover:text-blue-600">
          Music
        </NavLink>
        <NavLink to="/art" className="hover:text-blue-600">
          Art
        </NavLink>
        <NavLink to="/tuition" className="hover:text-blue-600">
          Tuition
        </NavLink>
        <NavLink to="/contact" className="hover:text-blue-600">
          Contact
        </NavLink>
      </ul>

      <Link
        to="/add-institution"
        className="hidden md:block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        List Your Institute
      </Link>
    </nav>
  </header>
);

export default Header;
