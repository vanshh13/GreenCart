import React, { useState, useEffect } from "react";

const images = [
  "/1.jpg",
  "/2.jpg",
  "/3.jpg",
  "/4.jpg",
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Auto slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[400px] overflow-hidden">
      {/* Image Display */}
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="w-full h-[400px] object-cover transition-opacity duration-700 ease-in-out"
      />

      {/* Left Button */}
      <button
        className="absolute top-1/2 left-4 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full"
        onClick={() =>
          setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1)
        }
      >
        ❮
      </button>

      {/* Right Button */}
      <button
        className="absolute top-1/2 right-4 bg-gray-700 bg-opacity-50 text-white p-2 rounded-full"
        onClick={() =>
          setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1)
        }
      >
        ❯
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`h-2 w-2 rounded-full ${
              i === currentIndex ? "bg-green-500" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;