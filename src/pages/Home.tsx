import { useState, useEffect, useCallback } from 'react';
import InstitutionCard from '../components/institution/InstitutionCard';
import SearchSection from '../components/common/SearchSection';
import Slider from '../components/ui/Slider';
import type { Institution, SearchFilters } from '../types';

const Home: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [filtered, setFiltered] = useState<Institution[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInstitutions = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/data/institutions.json');
        
        if (!response.ok) {
          throw new Error('Failed to load institutions');
        }
        
        const data: Institution[] = await response.json();
        setInstitutions(data);
        setFiltered(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error loading institutions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadInstitutions();
  }, []);

  const handleSearch = useCallback((filters: SearchFilters): void => {
    let filteredInstitutions = institutions;

    // Filter by search query
    if (filters.searchTerm && filters.searchTerm.trim()) {
      const searchTerm = filters.searchTerm.toLowerCase();
      filteredInstitutions = filteredInstitutions.filter(inst =>
        inst.name.toLowerCase().includes(searchTerm) ||
        inst.tagline.toLowerCase().includes(searchTerm) ||
        inst.type.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by location
    if (filters.area && filters.area.trim()) {
      const location = filters.area.toLowerCase();
      filteredInstitutions = filteredInstitutions.filter(inst =>
        inst.city.toLowerCase().includes(location) ||
        inst.area.toLowerCase().includes(location)
      );
    }

    setFiltered(filteredInstitutions);
  }, [institutions]);

  const clearFilters = useCallback((): void => {
    setFiltered(institutions);
  }, [institutions]);


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

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-red-400 mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Institutions</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Try Again
          </button>
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

    </main>
  );
};

export default Home;
