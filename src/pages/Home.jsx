import { useState, useEffect } from 'react';
import InstitutionCard from '../components/institution/InstitutionCard';
import SearchSection from '../components/common/SearchSection';
import Slider from '../components/ui/Slider';

const Home = () => {
  const [institutions, setInstitutions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInstitutions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/institutions.json');
        const data = await response.json();
        setInstitutions(data);
        setFiltered(data);
      } catch (error) {
        console.error('Error loading institutions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadInstitutions();
  }, []);

  const handleSearch = ({ query, category, location }) => {
    let filteredInstitutions = institutions;

    // Filter by search query
    if (query && query.trim()) {
      filteredInstitutions = filteredInstitutions.filter(inst =>
        inst.name.toLowerCase().includes(query.toLowerCase()) ||
        (inst.tagline && inst.tagline.toLowerCase().includes(query.toLowerCase())) ||
        (inst.type && inst.type.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Filter by category
    if (category) {
      filteredInstitutions = filteredInstitutions.filter(inst => inst.category === category);
    }

    // Filter by location
    if (location && location.trim()) {
      filteredInstitutions = filteredInstitutions.filter(inst =>
        inst.city.toLowerCase().includes(location.toLowerCase()) ||
        (inst.area && inst.area.toLowerCase().includes(location.toLowerCase()))
      );
    }

    setFiltered(filteredInstitutions);
  };

  const clearFilters = () => {
    setFiltered(institutions);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading institutions...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Slider />

      {/* Search Section */}
      <section className="container mx-auto px-4 py-8">
        <SearchSection onSearch={handleSearch} />
      </section>

      {/* Results Section */}
      <section className="container mx-auto px-4 pb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {filtered.length === institutions.length 
              ? `Featured Institutions (${institutions.length})` 
              : `Search Results (${filtered.length})`
            }
          </h2>
          
          {filtered.length !== institutions.length && (
            <button 
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Clear Filters
            </button>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(inst => (
              <InstitutionCard key={inst.id} inst={inst} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-400 mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Institutions Found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or browse all institutions.</p>
            <button 
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
            >
              Show All Institutions
            </button>
          </div>
        )}
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-12 bg-white">
        <h2 className="text-2xl font-bold text-center mb-8">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { category: 'music', name: 'Music Schools', icon: '🎵', color: 'bg-purple-100 text-purple-700' },
            { category: 'art', name: 'Art Studios', icon: '🎨', color: 'bg-pink-100 text-pink-700' },
            { category: 'tuition', name: 'Tuition Centers', icon: '📚', color: 'bg-blue-100 text-blue-700' },
            { category: 'dance', name: 'Dance Schools', icon: '💃', color: 'bg-green-100 text-green-700' },
          ].map(cat => (
            <button
              key={cat.category}
              onClick={() => handleSearch({ query: '', category: cat.category, location: '' })}
              className={`p-6 rounded-lg text-center hover:shadow-md transition-shadow ${cat.color}`}
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <h3 className="font-semibold">{cat.name}</h3>
              <p className="text-sm opacity-80">
                {institutions.filter(inst => inst.category === cat.category).length} available
              </p>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
