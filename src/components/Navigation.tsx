import { NavLink } from 'react-router-dom';
import type { ComponentWithClassName } from '../types';

interface NavigationProps extends ComponentWithClassName {}

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => (
  <ul className={`flex gap-6 font-medium ${className}`}>
    <NavLink to="/tuition" className="hover:text-blue-600">Education</NavLink>
  </ul>
);

export default Navigation;
