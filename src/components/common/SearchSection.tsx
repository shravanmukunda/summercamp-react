import { useState } from 'react';
import type { SearchFilters } from '../../types/institution';
import { CITIES } from '../../utils/constants';

interface SearchSectionProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
}

const SearchSection: React.FC<SearchSectionProps> = ({ onSearch, className = '' }) => {
  const [query, setQuery] = useState<string>('');
  const [location, setLocation] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    onSearch({ 
      searchTerm: query, 
      area: location 
    });
  };

  const clearFilters = (): void => {
    setQuery('');
    setLocation('');
    onSearch({ searchTerm: '', category: undefined, area: '' });
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => 
    (e: React.ChangeEvent<HTMLInputElement>) => setter(e.target.value);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setLocation(e.target.value);
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 mb-8 ${className}`}>
      <h2 className="text-xl font-semibold mb-4 text-center">Find Your Perfect Learning Institution</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-0 md:grid md:grid-cols-4 md:gap-4">
        {/* Search Query */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="search-query">
            Search
          </label>
          <input
            id="search-query"
            type="text"
            placeholder="Institution name, course..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={query}
            onChange={handleInputChange(setQuery)}
          />
        </div>


        {/* Location Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location-select">
            Location
          </label>
          <select
            id="location-select"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={location}
            onChange={handleSelectChange}
          >
            <option value="">All Locations</option>
            {CITIES.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchSection;