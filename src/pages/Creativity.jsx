import { useState } from 'react'
import SearchSection from '../components/SearchSection'
import CampCards from '../components/CampCards'

const Creativity = () => {
  const [searchFilters, setSearchFilters] = useState({})

  const handleSearch = (filters) => {
    setSearchFilters(filters)
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Creative Arts Summer Camps</h1>
          <p className="text-xl">Unleash your imagination through arts, crafts, and creative expression</p>
        </div>
      </div>
      <SearchSection onSearch={handleSearch} />
      <CampCards filters={searchFilters} categoryFilter="Creativity" />
    </div>
  )
}

export default Creativity
