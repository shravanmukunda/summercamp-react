import { useState } from 'react'
import SearchSection from '../components/SearchSection'
import CampCards from '../components/CampCards'

const Music = () => {
  const [searchFilters, setSearchFilters] = useState({})

  const handleSearch = (filters) => {
    setSearchFilters(filters)
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Music Summer Camps</h1>
          <p className="text-xl">Discover your musical talents and create beautiful melodies</p>
        </div>
      </div>
      <SearchSection onSearch={handleSearch} />
      <CampCards filters={searchFilters} categoryFilter="Music" />
    </div>
  )
}

export default Music
