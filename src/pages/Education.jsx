import { useState } from 'react'
import SearchSection from '../components/SearchSection'
import CampCards from '../components/CampCards'

const Education = () => {
  const [searchFilters, setSearchFilters] = useState({})

  const handleSearch = (filters) => {
    setSearchFilters(filters)
  }

  return (
    <div>
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Educational Summer Camps</h1>
          <p className="text-xl">Learn new skills and expand your knowledge in fun, interactive ways</p>
        </div>
      </div>
      <SearchSection onSearch={handleSearch} />
      <CampCards filters={searchFilters} categoryFilter="Education" />
    </div>
  )
}

export default Education
