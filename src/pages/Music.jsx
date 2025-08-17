import { useState, useEffect } from 'react';
import InstitutionCard from '../components/institution/InstitutionCard';
import SearchSection from '../components/common/SearchSection';

const Music = () => {
  const [musicInstitutions, setMusicInstitutions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMusicInstitutions = async () => {
      try {
        setLoading(true);
        const response = await fetch('/data/institutions.json');
        const allInstitutions = await response.json();
        
        // Filter only music institutions
        const musicOnly = allInstitutions.filter(inst => inst.category === 'music');
        setMusicInstitutions(musicOnly);
        setFiltered(musicOnly);
      } catch (error) {
        console.error('Error loading music institutions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMusicInstitutions();
  }, []);

  const handleSearch = ({ query, location }) => {
    let filteredInstitutions = musicInstitutions;

    if (query && query.trim()) {
      filteredInstitutions = filteredInstitutions.filter(inst =>
        inst.name.toLowerCase().includes(query.toLowerCase()) ||
        (inst.tagline && inst.tagline.toLowerCase().includes(query.toLowerCase()))
      );
    }

    if (location && location.trim()) {
      filteredInstitutions = filteredInstitutions.filter(inst =>
        inst.city.toLowerCase().includes(location.toLowerCase()) ||
        (inst.area && inst.area.toLowerCase().includes(location.toLowerCase()))
      );
    }

    setFiltered(filteredInstitutions);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading music schools...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Music Schools & Academies</h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Discover the best music schools in your area. Learn instruments, vocals, 
            and music theory from certified professionals.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4 py-8">
        <SearchSection onSearch={handleSearch} />
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 pb-12">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Music Schools ({filtered.length})
          </h2>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(inst => (
              <InstitutionCard key={inst.id} inst={inst} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl text-gray-400 mb-4">🎵</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Music Schools Found</h3>
            <p className="text-gray-600">Try adjusting your search criteria.</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default Music;
