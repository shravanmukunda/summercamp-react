import { useState, useEffect, useCallback } from 'react';

interface SliderProps {
  mobileSlides?: string[];
  pcSlides?: string[];
  autoPlayInterval?: number;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({ 
  mobileSlides = ['/banner/banner1.svg', '/banner/banner2.svg', '/banner/banner3.svg', '/banner/banner4.svg'],
  pcSlides = ['/banner/banner1PC.svg', '/banner/banner2PC.svg', '/banner/banner3PC.svg', '/banner/banner4PC.svg'],
  autoPlayInterval = 5000,
  className = '' 
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  
  const nextSlide = useCallback((): void => {
    setCurrentSlide((prev) => (prev + 1) % mobileSlides.length);
  }, [mobileSlides.length]);

  const prevSlide = (): void => {
    setCurrentSlide((prev) => (prev - 1 + mobileSlides.length) % mobileSlides.length);
  };

  const goToSlide = (index: number): void => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [nextSlide, autoPlayInterval]);
  
  // Reset slide index when slides change (screen size changes)
  useEffect(() => {
    if (currentSlide >= mobileSlides.length) {
      setCurrentSlide(0);
    }
  }, [mobileSlides.length, currentSlide]);

  return (
    <div className={`relative max-w-full mx-auto overflow-hidden ${className}`}>
      <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96">
        {mobileSlides.map((_, index) => {
          // Get corresponding mobile and PC slides for this index
          const mobileSlide = mobileSlides[index] || mobileSlides[0];
          const pcSlide = pcSlides[index] || pcSlides[0];
          
          return (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: index === currentSlide ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out'
              }}
              role="img"
              aria-label={`Slide ${index + 1} of ${mobileSlides.length}`}
            >
              {/* Mobile banner */}
              <div 
                className="block md:hidden w-full h-full"
                style={{
                  backgroundImage: `url(${mobileSlide})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }}
              />
              {/* PC banner */}
              <div 
                className="hidden md:block w-full h-full"
                style={{
                  backgroundImage: `url(${pcSlide})`,
                  backgroundSize: 'contain',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center'
                }}
              />
            </div>
          );
        })}
      </div>
      
      <button 
        className="slider-btn left-2 sm:left-4 absolute top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 sm:p-2 rounded-full hover:bg-opacity-75 transition-all text-sm sm:text-base"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        &#10094;
      </button>
      
      <button 
        className="slider-btn right-2 sm:right-4 absolute top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 sm:p-2 rounded-full hover:bg-opacity-75 transition-all text-sm sm:text-base"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        &#10095;
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1 sm:space-x-2">
        {mobileSlides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
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
