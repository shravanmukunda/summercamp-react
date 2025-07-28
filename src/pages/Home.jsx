import { useState } from 'react'
import Slider from '../components/Slider'
import SearchSection from '../components/SearchSection'
import CampCards from '../components/CampCards'

const Home = () => {
  const [searchFilters, setSearchFilters] = useState({})

  const handleSearch = (filters) => {
    setSearchFilters(filters)
  }

  return (
    <div>
      <Slider />
      <SearchSection onSearch={handleSearch} />
      <CampCards filters={searchFilters} />
    </div>
  )
}

export default Home
