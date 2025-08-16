import { useState, useEffect } from 'react'

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  
  const slides = [
    '/banner/banner1.svg',
    '/banner/banner2.svg',
    '/banner/banner3.svg',
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative max-w-full mx-auto overflow-hidden">
      <div className="relative w-full h-96">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${slide})`,
            }}
          />
        ))}
      </div>
      
      <button 
        className="slider-btn left-4"
        onClick={prevSlide}
      >
        &#10094;
      </button>
      
      <button 
        className="slider-btn right-4"
        onClick={nextSlide}
      >
        &#10095;
      </button>
    </div>
  )
}

export default Slider
