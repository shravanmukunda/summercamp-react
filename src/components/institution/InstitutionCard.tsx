import { Link } from 'react-router-dom';
import type { Institution } from '../../types';

interface InstitutionCardProps {
  inst: Institution;
  className?: string;
}

const InstitutionCard: React.FC<InstitutionCardProps> = ({ inst, className = '' }) => {
  const renderStars = (rating: number): React.ReactNode[] => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className="text-sm">
        {i < Math.floor(rating) ? '★' : '☆'}
      </span>
    ));
  };

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${className}`}>
      {/* Image */}
      <div className="relative">
        <img 
          src={inst.image || '/images/placeholder-institution.jpg'} 
          alt={inst.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {inst.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
            {inst.name}
          </h3>
          <p className="text-sm text-gray-600 flex items-center">
            <span className="mr-1">📍</span>
            {inst.area}, {inst.city}
          </p>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400 mr-2">
            {renderStars(inst.rating)}
          </div>
          <span className="text-sm text-gray-600">
            {inst.rating} ({inst.reviewCount.toLocaleString()} reviews)
          </span>
        </div>

        {/* Tagline */}
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
          {inst.tagline}
        </p>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div className="text-blue-600 font-semibold">
            Starting from ₹{inst.startingPrice?.toLocaleString()}
          </div>
        </div>

        <Link 
          to={`/institution/${inst.id}`}
          className="block w-full mt-4 bg-blue-600 text-white text-center py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default InstitutionCard;
