import { NavLink } from 'react-router-dom';

const Navigation = () => (
  <ul className="flex gap-6 font-medium">
    <NavLink to="/tuition"  className="hover:text-blue-600">Education</NavLink>
    <NavLink to="/dance"    className="hover:text-blue-600">Dance</NavLink>
    <NavLink to="/music"    className="hover:text-blue-600">Music</NavLink>
    <NavLink to="/art"      className="hover:text-blue-600">Creativity</NavLink>
  </ul>
);

export default Navigation;
