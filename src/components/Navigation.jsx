import { Link } from 'react-router-dom'

const Navigation = () => {
  return (
    <nav className="flex justify-between max-w-6xl mx-auto p-4">
      <div className="flex gap-6">
        <Link to="/categories/sports" className="text-gray-800 font-medium hover:text-red-600 transition-colors">
          Sports
        </Link>
        <Link to="/categories/education" className="text-gray-800 font-medium hover:text-red-600 transition-colors">
          Education
        </Link>
        <Link to="/categories/dance" className="text-gray-800 font-medium hover:text-red-600 transition-colors">
          Dance
        </Link>
        <Link to="/categories/music" className="text-gray-800 font-medium hover:text-red-600 transition-colors">
          Music
        </Link>
        <Link to="/categories/creativity" className="text-gray-800 font-medium hover:text-red-600 transition-colors">
          Creativity
        </Link>
        <Link to="/categories/adventure" className="text-gray-800 font-medium hover:text-red-600 transition-colors">
          Adventure
        </Link>
      </div>
    </nav>
  )
}

export default Navigation
