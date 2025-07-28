import { useState } from 'react'

const SearchSection = ({ onSearch }) => {
  const [selectedActivity, setSelectedActivity] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  const handleSearch = () => {
    onSearch({ activity: selectedActivity, location: selectedLocation })
  }

  return (
    <section className="py-8 flex justify-center">
      <div className="flex gap-2 items-center flex-wrap">
        <select 
          value={selectedActivity}
          onChange={(e) => setSelectedActivity(e.target.value)}
          className="flex-1 min-w-36 max-w-48 p-3 border border-red-600 rounded text-base"
        >
          <option value="">All Activities</option>
          <option value="Badminton">Badminton</option>
          <option value="Football">Football</option>
          <option value="Basketball">Basketball</option>
          <option value="Skating">Skating</option>
          <option value="Cricket">Cricket</option>
          <option value="Dance">Dance</option>
          <option value="Multiple">Multiple-Activities</option>
          <option value="Music">Music</option>
          <option value="Swimming">Swimming</option>
          <option value="Adventure">Adventure</option>
          <option value="Education">Education</option>
          <option value="Athletics">Athletics</option>
          <option value="Art">Art</option>
          <option value="Fitness">Fitness</option>
        </select>
        
        <select 
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="flex-1 min-w-36 max-w-48 p-3 border border-red-600 rounded text-base"
        >
          <option value="">All Locations</option>
        </select>
        
        <button 
          onClick={handleSearch}
          className="bg-red-600 text-black border-none py-3 px-8 rounded cursor-pointer transition-colors hover:bg-red-700 font-roboto text-xl whitespace-nowrap"
        >
          Search Camps
        </button>
      </div>
    </section>
  )
}

export default SearchSection
