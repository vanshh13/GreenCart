import React, { useState, useEffect } from 'react';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: "/api/placeholder/1200/400",
      title: "Fresh Organic Produce",
      description: "Shop our latest collection of organic fruits and vegetables"
    },
    {
      id: 2,
      image: "/api/placeholder/1200/400",
      title: "Special Offers",
      description: "Up to 30% off on selected items"
    },
    {
      id: 3,
      image: "/api/placeholder/1200/400",
      title: "Free Delivery",
      description: "On orders above $50"
    },
    {
      id: 4,
      image: "/api/placeholder/1200/400",
      title: "New Arrivals",
      description: "Check out our latest products"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-96 overflow-hidden">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div 
            key={slide.id}
            className="w-full h-full flex-shrink-0 relative"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white">
              <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
              <p className="text-xl">{slide.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              currentSlide === index ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;