import { Link } from 'react-router-dom';

const InstitutionCard = ({ inst }) => (
  <div className="rounded-lg shadow hover:shadow-lg transition">
    <img
      src={inst.cover || '/placeholder.jpg'}
      alt={inst.name}
      className="h-44 w-full object-cover"
    />

    <div className="p-5">
      <h3 className="text-lg font-semibold">{inst.name}</h3>
      <p className="text-sm text-gray-500">{inst.location}</p>

      <div className="flex items-center text-xs mt-2">
        <span className="text-yellow-400">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>{i < inst.rating ? '★' : '☆'}</span>
          ))}
        </span>
        <span className="ml-1 text-gray-600">
          ({inst.reviewCount} reviews)
        </span>
      </div>

      <p className="line-clamp-2 text-sm mt-3">{inst.tagline}</p>

      <Link
        to={`/institution/${inst.id}`}
        className="block w-full bg-blue-600 text-white text-center py-2 rounded-md mt-4 hover:bg-blue-700"
      >
        View Details
      </Link>
    </div>
  </div>
);

export default InstitutionCard;
