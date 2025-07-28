import { useState } from 'react'
import SearchSection from '../components/SearchSection'
import CampCards from '../components/CampCards'

const Sports = () => {
  const [searchFilters, setSearchFilters] = useState({})

  const handleSearch = (filters) => {
    setSearchFilters(filters)
  }

  return (
    <div>
      <SearchSection onSearch={handleSearch} />
      <CampCards filters={searchFilters} categoryFilter="Sports" />
    </div>
  )
}

export default Sports
