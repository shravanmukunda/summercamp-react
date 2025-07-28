import { useState } from 'react'

const Header = () => {
  const [selectedCity, setSelectedCity] = useState('Bangalore')

  return (
    <header className="bg-white shadow-md py-2 w-full sticky top-0 z-50">
      <div className="flex justify-between items-center max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center w-full">
          {/* Logo */}
          <div className="h-full">
            <img 
              src="/logo.svg" 
              alt="My Summer Camp - Find Best Summer Camps in India" 
              className="h-full w-auto cursor-pointer block"
            />
          </div>
          
          {/* Location Selector */}
          <div className="flex items-center bg-white p-2 border-2 border-red-600 rounded-md cursor-pointer transition-all duration-200 hover:border-red-800 hover:bg-red-50">
            <select 
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="p-0 border-none bg-transparent text-base font-medium text-gray-800 cursor-pointer appearance-none pr-5 focus:outline-none"
            >
              <option value="Bangalore">Bangalore</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Chennai">Chennai</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
