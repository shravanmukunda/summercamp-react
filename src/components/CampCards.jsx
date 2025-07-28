import { useState, useEffect } from 'react'

const CampCards = ({ filters = {}, categoryFilter = '' }) => {
  const [camps, setCamps] = useState([])
  const [filteredCamps, setFilteredCamps] = useState([])

  useEffect(() => {
    // Load camps data
    fetch('/camps.json')
      .then(response => response.json())
      .then(data => {
        setCamps(data)
        filterCamps(data, filters, categoryFilter)
      })
      .catch(error => console.error('Error loading camp data:', error))
  }, [])

  useEffect(() => {
    filterCamps(camps, filters, categoryFilter)
  }, [filters, categoryFilter, camps])

  const filterCamps = (campsData, filters, categoryFilter) => {
    let allCamps = []
    
    Object.keys(campsData).forEach(city => {
      campsData[city].forEach(camp => {
        // Apply category filter
        if (categoryFilter) {
          const campCategories = Array.isArray(camp.category) ? camp.category : [camp.category]
          if (!campCategories.includes(categoryFilter)) {
            return
          }
        }
        
        // Apply activity filter
        if (filters.activity && camp.activity !== filters.activity) {
          return
        }
        
        allCamps.push({ ...camp, city })
      })
    })
    
    setFilteredCamps(allCamps)
  }

  return (
    <section className="max-w-6xl mx-auto my-10 px-5">
      <div className="relative mb-8">
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">
          Best Summer Camps in India – Sports, Dance, Music & More
        </h1>
        <div className="absolute -bottom-2 left-0 w-15 h-1 bg-gradient-to-r from-red-400 to-orange-400 rounded"></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredCamps.map((camp, index) => (
          <a
            key={index}
            href={camp.link}
            className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden cursor-pointer group"
          >
            <figure className="m-0 relative overflow-hidden">
              <img
                src={camp.image}
                alt={camp.name}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <figcaption className="p-4">
                <div className="font-semibold text-base text-gray-800 text-left leading-6 group-hover:text-red-400 transition-colors">
                  {camp.name}
                </div>
                <div className="mt-2">
                  <span className="block text-sm text-red-400 font-medium">
                    {camp.activity}
                  </span>
                  <span className="block text-sm text-red-400 font-medium">
                    {Array.isArray(camp.category) ? camp.category.join(', ') : camp.category}
                  </span>
                  <span className="block text-xs text-gray-600 mt-1 truncate">
                    {camp.location}
                  </span>
                </div>
              </figcaption>
            </figure>
            
            {/* Hover overlay with "View Details" */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 rounded-xl pointer-events-none"></div>
<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500/90 text-white py-2 px-4 rounded font-medium z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 fade-in pointer-events-none">
              View Details
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}

export default CampCards
