import { useState, useEffect, useCallback } from 'react';

interface SliderProps {
  slides?: string[];
  autoPlayInterval?: number;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({ 
  slides = ['/banner/banner1.svg', '/banner/banner2.svg', '/banner/banner3.svg'],
  autoPlayInterval = 5000,
  className = '' 
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  
  const nextSlide = useCallback((): void => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = (): void => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number): void => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [nextSlide, autoPlayInterval]);

  return (
    <div className={`relative max-w-full mx-auto overflow-hidden ${className}`}>
      <div className="relative w-full h-96">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{
              backgroundImage: `url(${slide})`,
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: index === currentSlide ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out'
            }}
            role="img"
            aria-label={`Slide ${index + 1} of ${slides.length}`}
          />
        ))}
      </div>
      
      <button 
        className="slider-btn left-4 absolute top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        &#10094;
      </button>
      
      <button 
        className="slider-btn right-4 absolute top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        &#10095;
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
