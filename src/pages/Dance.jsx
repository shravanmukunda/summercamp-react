import { useState } from 'react';
import InstitutionCard from '../components/InstitutionCard';
import SearchSection from '../components/SearchSection';

const Music = () => {
  const [results, setResults] = useState([]);

  const handleSearch = (filters) => {
    // call API with filters + category=music
    setResults([
      /* mock items */
    ]);
  };

  return (
    <main className="container mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-bold">Music Schools</h1>
      <SearchSection onSearch={handleSearch} />

      {!!results.length && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((inst) => (
            <InstitutionCard inst={inst} key={inst.id} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Music;
