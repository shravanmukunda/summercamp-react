import { useState } from 'react'
import SearchSection from '../components/SearchSection'
import CampCards from '../components/CampCards'

const Adventure = () => {
  const [searchFilters, setSearchFilters] = useState({})

  const handleSearch = (filters) => {
    setSearchFilters(filters)
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Adventure Summer Camps</h1>
          <p className="text-xl">Explore the outdoors and challenge yourself with thrilling activities</p>
        </div>
      </div>
      <SearchSection onSearch={handleSearch} />
      <CampCards filters={searchFilters} categoryFilter="Adventure" />
    </div>
  )
}

export default Adventure
