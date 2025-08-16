import { useState } from 'react';

const SearchSection = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  const submit = (e) => {
    e.preventDefault();
    onSearch({ query, category, location });
  };

  const clear = () => {
    setQuery('');
    setCategory('');
    setLocation('');
    onSearch({ query: '', category: '', location: '' });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <form onSubmit={submit} className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search institution or course"
          className="flex-grow border rounded-md px-4 py-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="border rounded-md px-4 py-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="music">Music</option>
          <option value="art">Art</option>
          <option value="tuition">Tuition</option>
          <option value="dance">Dance</option>
        </select>

        <input
          type="text"
          placeholder="City / Area"
          className="border rounded-md px-4 py-2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-md">
            Search
          </button>
          <button
            type="button"
            onClick={clear}
            className="bg-gray-500 text-white px-4 py-2 rounded-md"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchSection;
