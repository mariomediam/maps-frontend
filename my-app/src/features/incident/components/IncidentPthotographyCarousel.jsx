import React, { memo, useState, useEffect } from "react";

const IncidentPthotographyCarousel = memo(({ photographs = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (photographs.length === 0) {
        return <></>;
    }


  // Validar que las fotografías tengan la estructura correcta
  const validPhotographs = photographs.filter(photo => 
    photo && 
    typeof photo === 'object' && 
    photo.url && 
    photo.id_photography
  );

  if (validPhotographs.length === 0) {
    return <div className="text-center text-gray-500 p-4">No hay imágenes disponibles</div>;
  }

  // Funciones de navegación
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? validPhotographs.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === validPhotographs.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Navegación con teclado
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div>
      <div
        id="indicators-carousel"
        className="relative w-full"
        data-carousel="static"
      >
        {/* <!-- Carousel wrapper --> */}
        <div className="relative w-full h-64 overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
          {/* <!-- Item 1 -->
        <div className="hidden duration-700 ease-in-out" data-carousel-item="active">
            <img src="/docs/images/carousel/carousel-1.svg" className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
        </div>
        <!-- Item 2 -->
        <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="/docs/images/carousel/carousel-2.svg" className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
        </div>
        <!-- Item 3 -->
        <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="/docs/images/carousel/carousel-3.svg" className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
        </div>
        <!-- Item 4 -->
        <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="/docs/images/carousel/carousel-4.svg" className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
        </div>
        <!-- Item 5 -->
        <div className="hidden duration-700 ease-in-out" data-carousel-item>
            <img src="/docs/images/carousel/carousel-5.svg" className="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
        </div> */}
          {validPhotographs.map((photograph, index) => (
            <div
              key={photograph.id_photography}
              className={`duration-700 ease-in-out flex items-center justify-center ${index === currentIndex ? 'block' : 'hidden'}`}
              data-carousel-item={index === currentIndex ? "active" : ""}
            >
              <img
                src={photograph.url}
                className="max-w-full max-h-full object-contain"
                alt={`Fotografía ${index + 1} del incidente`}
                onError={(e) => {
                  console.error(`Error cargando imagen: ${photograph.url}`);
                  e.target.style.display = 'none';
                }}
              />
            </div>
          ))}
        </div>
        {/* <!-- Slider indicators --> */}
        <div className="absolute z-50 flex -translate-x-1/2 space-x-3 rtl:space-x-reverse bottom-5 left-1/2">
          {validPhotographs.map((photograph, index) => (
            <button
              key={photograph.id_photography}
              type="button"
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex 
                  ? 'bg-white border-2 border-gray-800' 
                  : 'bg-white/50 border border-gray-600 hover:bg-white/80'
              }`}
              aria-current={index === currentIndex ? "true" : "false"}
              aria-label={`Slide ${index + 1}`}
              data-carousel-slide-to={index}
              onClick={() => goToSlide(index)}
            ></button>
          ))}
        </div>
        {/* <!-- Slider controls --> */}
        <button
          type="button"
          className="absolute top-0 start-0 z-50 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          data-carousel-prev
          onClick={goToPrevious}
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/50 group-hover:bg-black/70 group-focus:ring-4 group-focus:ring-white group-focus:outline-none transition-colors">
            <svg
              className="w-4 h-4 text-white rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
            <span className="sr-only">Previous</span>
          </span>
        </button>
        <button
          type="button"
          className="absolute top-0 end-0 z-50 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
          data-carousel-next
          onClick={goToNext}
        >
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/50 group-hover:bg-black/70 group-focus:ring-4 group-focus:ring-white group-focus:outline-none transition-colors">
            <svg
              className="w-4 h-4 text-white rtl:rotate-180"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
            <span className="sr-only">Next</span>
          </span>
        </button>
      </div>
    </div>
  );
});

IncidentPthotographyCarousel.displayName = 'IncidentPhotographyCarousel';

export default IncidentPthotographyCarousel;
