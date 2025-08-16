import { useState, useEffect } from 'react';
import InstitutionCard from '../components/InstitutionCard';
import SearchSection from '../components/SearchSection';
import Slider from '../components/Slider';

const Home = () => {
  const [allInstitutions] = useState([
    { id: 1, name: 'Galaxy Tuition', category: 'tuition', location: 'Bangalore', rating: 4.5, reviewCount: 43, cover: '/demo.jpg', tagline: 'Expert faculty • Flexible batches' },
    { id: 2, name: 'Harmony Music School', category: 'music', location: 'Delhi', rating: 4.8, reviewCount: 67, cover: '/demo.jpg', tagline: 'Piano • Guitar • Vocals' },
    { id: 3, name: 'Artistic Minds', category: 'art', location: 'Mumbai', rating: 4.3, reviewCount: 34, cover: '/demo.jpg', tagline: 'Painting • Sketching • Digital Art' },
    { id: 4, name: 'Elite Dance Academy', category: 'dance', location: 'Bangalore', rating: 4.6, reviewCount: 52, cover: '/demo.jpg', tagline: 'Classical • Hip-hop • Contemporary' },
    { id: 5, name: 'Sports Champions', category: 'sports', location: 'Chennai', rating: 4.4, reviewCount: 29, cover: '/demo.jpg', tagline: 'Cricket • Football • Tennis' },
    { id: 6, name: 'Bright Future Coaching', category: 'tuition', location: 'Mumbai', rating: 4.7, reviewCount: 81, cover: '/demo.jpg', tagline: 'JEE • NEET • Board Exams' }
  ]);

  const [filtered, setFiltered] = useState(allInstitutions);

  const handleSearch = ({ query, category, location }) => {
    let res = allInstitutions;

    if (query.trim()) {
      res = res.filter(i =>
        i.name.toLowerCase().includes(query.toLowerCase()) ||
        i.tagline.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (category) res = res.filter(i => i.category === category);
    if (location.trim()) {
      res = res.filter(i =>
        i.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    setFiltered(res);
  };

  useEffect(() => setFiltered(allInstitutions), [allInstitutions]);

  return (
    <main className="container mx-auto px-4 space-y-14">
      <Slider />

      <SearchSection onSearch={handleSearch} />

      <section>
        <h2 className="text-2xl font-semibold mb-6">
          {filtered.length === allInstitutions.length
            ? 'Featured Institutions'
            : `Found ${filtered.length} Result${filtered.length !== 1 ? 's' : ''}`}
        </h2>

        {filtered.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map(inst => (
              <InstitutionCard key={inst.id} inst={inst} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No matches found.</p>
        )}
      </section>
    </main>
  );
};

export default Home;
