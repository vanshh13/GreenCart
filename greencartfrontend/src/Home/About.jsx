import React, { useEffect, useState } from 'react';

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="about-page">
      {/* Background and container */}
      <div className="bg-gradient-to-b from-white to-green-50 min-h-screen w-full flex flex-col items-center">
        <div className="container mx-auto px-4 py-12 max-w-5xl">
          
          {/* Header Section */}
          <header className={`text-center mb-16 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-5xl font-bold text-gray-800 inline-block relative">
              About GreenCart
              <span className="absolute bottom-0 left-0 w-full h-1 bg-green-500 transform transition-transform duration-500 origin-left"></span>
            </h1>
          </header>
          
          {/* Section 1: Introduction */}
          <section className={`mb-20 text-center transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              At GreenCart, we believe that everyone deserves access to fresh, organic produce and products that nourish both the body and the planet. We've created a platform that connects conscious consumers with verified organic farmers and producers, ensuring transparency, quality, and sustainability at every step.
            </p>
            <p className="font-serif italic text-2xl text-green-600 mt-8">
              "Nurturing health, one organic choice at a time."
            </p>
          </section>
          
          {/* Section 2: Features */}
          <section className={`mb-20 transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">What We Offer</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Feature Card 1 */}
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border-l-4 border-green-500">
                <div className="flex items-start">
                  <span className="text-4xl mr-4">🌿</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Wide Range of Organic Products</h3>
                    <p className="text-gray-600">From fresh farm produce to pantry essentials, we offer a comprehensive selection of certified organic items for your everyday needs.</p>
                  </div>
                </div>
              </div>
              
              {/* Feature Card 2 */}
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border-l-4 border-green-500">
                <div className="flex items-start">
                  <span className="text-4xl mr-4">🔒</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Secure & Transparent Shopping</h3>
                    <p className="text-gray-600">Shop with confidence knowing every transaction is secure, and product information is transparent and verified.</p>
                  </div>
                </div>
              </div>
              
              {/* Feature Card 3 */}
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border-l-4 border-green-500">
                <div className="flex items-start">
                  <span className="text-4xl mr-4">🚚</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Fast & Reliable Delivery</h3>
                    <p className="text-gray-600">Enjoy eco-friendly packaging and reliable delivery options that bring freshness right to your doorstep.</p>
                  </div>
                </div>
              </div>
              
              {/* Feature Card 4 */}
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 border-l-4 border-green-500">
                <div className="flex items-start">
                  <span className="text-4xl mr-4">📊</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Powerful Admin Dashboard</h3>
                    <p className="text-gray-600">For vendors and admins, our intuitive dashboard provides comprehensive tools to manage products and monitor performance.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Section 3: Why Choose Us */}
          <section className={`mb-20 transition-all duration-1000 delay-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">Why Choose GreenCart?</h2>
            
            <div className="bg-white rounded-lg shadow-lg p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-full -mr-16 -mt-16 z-0"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <div className="text-center transition-transform hover:transform hover:scale-105 duration-300">
                  <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Quality Guaranteed</h3>
                  <p className="text-gray-600">Every product is verified for organic certification and quality standards.</p>
                </div>
                
                <div className="text-center transition-transform hover:transform hover:scale-105 duration-300">
                  <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4.632 3.533A2 2 0 016.577 2h6.846a2 2 0 011.945 1.533l1.976 8.234A3.489 3.489 0 0016 11.5c0 1.247-.684 2.342-1.697 2.924V14a2 2 0 01-2 2h-4.5a2 2 0 01-2-2v-.576A3.49 3.49 0 014 11.5c0-.279.028-.55.08-.814l.4.144-.4-.144 1.976-8.234zm-.744 10.468A1.5 1.5 0 004 13.5a1.5 1.5 0 001.5 1.5h9a1.5 1.5 0 001.5-1.5 1.5 1.5 0 00-.112-.568l-1.976-8.234a1 1 0 00-.973-.766H6.577a1 1 0 00-.973.766L3.628 13.0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Eco-Friendly Practices</h3>
                  <p className="text-gray-600">From packaging to delivery, we minimize our environmental footprint.</p>
                </div>
                
                <div className="text-center transition-transform hover:transform hover:scale-105 duration-300">
                  <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">Supporting Local Farmers</h3>
                  <p className="text-gray-600">We connect you directly with organic farmers in your region.</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* Footer with CTA */}
          <footer className={`text-center mt-16 transition-all duration-1000 delay-900 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <button 
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1"
            >
              Start Shopping
            </button>
            <p className="text-gray-500 mt-8">© 2025 GreenCart. All rights reserved.</p>
          </footer>
          
        </div>
      </div>
      
      {/* CSS Styles */}
      <style jsx>{`
        .about-page {
          font-family: 'Inter', sans-serif;
        }
        
        h1, h2, h3 {
          font-family: 'Montserrat', sans-serif;
        }
        
        .font-serif {
          font-family: 'Playfair Display', serif;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;