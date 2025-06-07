import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    
    // Add scroll event listener for parallax effect
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const sections = document.querySelectorAll('section');
      
      sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        if (scrollPosition >= sectionTop - 300) {
          setActiveSection(index);
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="about-page">
      {/* Fancy Back Button with Hover Effect */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => navigate(-1)}
          className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-teal-300 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 group-hover:-translate-x-1 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </button>
      </div>

      {/* Decorative Elements */}
      <div className="fixed top-0 right-0 w-64 h-64 bg-green-50 rounded-bl-full opacity-70 z-0"></div>
      <div className="fixed bottom-0 left-0 w-48 h-48 bg-emerald-50 rounded-tr-full opacity-70 z-0"></div>

      {/* Background and container */}
      <div className="bg-gradient-to-b from-white to-green-50 min-h-screen w-full flex flex-col items-center overflow-hidden">
        {/* Animated pattern overlay */}
        <div className="absolute inset-0 z-0 opacity-10 pattern-grid-lg text-green-500"></div>
        
        <div className="container mx-auto px-4 py-12 max-w-5xl relative z-10">
          
          {/* Header Section with Enhanced Animation */}
          <header className={`text-center mb-20 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="inline-block relative">
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400 mb-4">
                About GreenCart
              </h1>
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-400 transform transition-transform duration-700 origin-left scale-x-100"></span>
            </div>
            <p className="text-gray-600 mt-6 max-w-2xl mx-auto text-lg">
              Bringing nature's freshness directly to your doorstep
            </p>
          </header>
          
          {/* Section 1: Introduction with Fancy Border */}
          <section className={`mb-24 text-center transition-all duration-1000 delay-300 transform relative ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${activeSection === 0 ? 'scale-105' : 'scale-100'}`}>
            <div className="absolute -top-6 -left-6 w-12 h-12 border-t-2 border-l-2 border-green-400"></div>
            <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-2 border-r-2 border-green-400"></div>
            
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              At GreenCart, we believe that everyone deserves access to fresh, organic produce and products that nourish both the body and the planet. We've created a platform that connects conscious consumers with verified organic farmers and producers, ensuring transparency, quality, and sustainability at every step.
            </p>
            <p className="font-serif italic text-2xl text-green-600 mt-10 relative">
              <span className="absolute -left-8 top-0 text-4xl text-green-300">"</span>
              Nurturing health, one organic choice at a time.
              <span className="absolute -right-8 bottom-0 text-4xl text-green-300">"</span>
            </p>
          </section>
          
          {/* Section 2: Features with Hover Effects */}
          <section className={`mb-24 transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${activeSection === 1 ? 'scale-105' : 'scale-100'}`}>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400 mb-12 text-center">What We Offer</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Feature Card 1 - Enhanced */}
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-green-500 transform hover:-translate-y-2 group">
                <div className="flex items-start">
                  <span className="text-5xl mr-4 group-hover:scale-110 transition-transform duration-300">🌿</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">Wide Range of Organic Products</h3>
                    <p className="text-gray-600">From fresh farm produce to pantry essentials, we offer a comprehensive selection of certified organic items for your everyday needs.</p>
                  </div>
                </div>
                <div className="w-0 group-hover:w-full h-1 bg-gradient-to-r from-green-400 to-emerald-300 mt-4 transition-all duration-300"></div>
              </div>
              
              {/* Feature Card 2 - Enhanced */}
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-green-500 transform hover:-translate-y-2 group">
                <div className="flex items-start">
                  <span className="text-5xl mr-4 group-hover:scale-110 transition-transform duration-300">🔒</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">Secure & Transparent Shopping</h3>
                    <p className="text-gray-600">Shop with confidence knowing every transaction is secure, and product information is transparent and verified.</p>
                  </div>
                </div>
                <div className="w-0 group-hover:w-full h-1 bg-gradient-to-r from-green-400 to-emerald-300 mt-4 transition-all duration-300"></div>
              </div>
              
              {/* Feature Card 3 - Enhanced */}
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-green-500 transform hover:-translate-y-2 group">
                <div className="flex items-start">
                  <span className="text-5xl mr-4 group-hover:scale-110 transition-transform duration-300">🚚</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">Fast & Reliable Delivery</h3>
                    <p className="text-gray-600">Enjoy eco-friendly packaging and reliable delivery options that bring freshness right to your doorstep.</p>
                  </div>
                </div>
                <div className="w-0 group-hover:w-full h-1 bg-gradient-to-r from-green-400 to-emerald-300 mt-4 transition-all duration-300"></div>
              </div>
              
              {/* Feature Card 4 - Enhanced */}
              <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-6 border-l-4 border-green-500 transform hover:-translate-y-2 group">
                <div className="flex items-start">
                  <span className="text-5xl mr-4 group-hover:scale-110 transition-transform duration-300">📊</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors duration-300">Powerful Admin Dashboard</h3>
                    <p className="text-gray-600">For vendors and admins, our intuitive dashboard provides comprehensive tools to manage products and monitor performance.</p>
                  </div>
                </div>
                <div className="w-0 group-hover:w-full h-1 bg-gradient-to-r from-green-400 to-emerald-300 mt-4 transition-all duration-300"></div>
              </div>
            </div>
          </section>
          
          {/* Section 3: Why Choose Us - Enhanced with Glassmorphism */}
          <section className={`mb-24 transition-all duration-1000 delay-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${activeSection === 2 ? 'scale-105' : 'scale-100'}`}>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400 mb-12 text-center">Why Choose GreenCart?</h2>
            
            <div className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl p-8 relative overflow-hidden border border-green-100">
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-100 rounded-full -mr-20 -mt-20 z-0"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-50 rounded-full -ml-16 -mb-16 z-0"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <div className="text-center transition-all hover:transform hover:scale-105 duration-300 p-4 rounded-lg hover:bg-green-50">
                  <div className="bg-gradient-to-br from-green-400 to-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md transform transition-transform hover:rotate-12 duration-300">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Quality Guaranteed</h3>
                  <p className="text-gray-600">Every product is verified for organic certification and quality standards.</p>
                </div>
                
                <div className="text-center transition-all hover:transform hover:scale-105 duration-300 p-4 rounded-lg hover:bg-green-50">
                  <div className="bg-gradient-to-br from-green-400 to-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md transform transition-transform hover:rotate-12 duration-300">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4.632 3.533A2 2 0 016.577 2h6.846a2 2 0 011.945 1.533l1.976 8.234A3.489 3.489 0 0016 11.5c0 1.247-.684 2.342-1.697 2.924V14a2 2 0 01-2 2h-4.5a2 2 0 01-2-2v-.576A3.49 3.49 0 014 11.5c0-.279.028-.55.08-.814l.4.144-.4-.144 1.976-8.234zm-.744 10.468A1.5 1.5 0 004 13.5a1.5 1.5 0 001.5 1.5h9a1.5 1.5 0 001.5-1.5 1.5 1.5 0 00-.112-.568l-1.976-8.234a1 1 0 00-.973-.766H6.577a1 1 0 00-.973.766L3.628 13.0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Eco-Friendly Practices</h3>
                  <p className="text-gray-600">From packaging to delivery, we minimize our environmental footprint.</p>
                </div>
                
                <div className="text-center transition-all hover:transform hover:scale-105 duration-300 p-4 rounded-lg hover:bg-green-50">
                  <div className="bg-gradient-to-br from-green-400 to-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md transform transition-transform hover:rotate-12 duration-300">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Supporting Local Farmers</h3>
                  <p className="text-gray-600">We connect you directly with organic farmers in your region.</p>
                </div>
              </div>
            </div>
          </section>
          
          {/* New Section: Testimonials */}
          <section className={`mb-24 transition-all duration-1000 delay-900 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} ${activeSection === 3 ? 'scale-105' : 'scale-100'}`}>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-400 mb-12 text-center">What Our Customers Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Testimonial 1 */}
              <div className="bg-white p-6 rounded-lg shadow-lg relative">
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 4C11.373 4 6 9.373 6 16C6 22.627 11.373 28 18 28H22V36C22 36 34 28 34 16C34 9.373 28.627 4 22 4H18Z" fill="#E0F2E9"/>
                  </svg>
                </div>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold">SJ</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Sarah Johnson</h4>
                    <div className="flex text-yellow-400">
                      <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"GreenCart has transformed how I shop for organic food. The produce is always fresh, and I love being able to support local farmers."</p>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-white p-6 rounded-lg shadow-lg relative">
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18 4C11.373 4 6 9.373 6 16C6 22.627 11.373 28 18 28H22V36C22 36 34 28 34 16C34 9.373 28.627 4 22 4H18Z" fill="#E0F2E9"/>
                  </svg>
                </div>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600 font-bold">MT</span>
                  </div>
                  <div>
                    <h4 className="font-bold">Mark Thompson</h4>
                    <div className="flex text-yellow-400">
                      <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 italic">"The user experience is seamless, and I appreciate the transparency about where my food is coming from. Delivery is always on time!"</p>
              </div>
            </div>
          </section>
          
          {/* Footer with Enhanced CTA */}
          <footer className={`text-center mt-16 transition-all duration-1000 delay-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <button 
              className="relative overflow-hidden group bg-gradient-to-r from-green-500 to-emerald-400 text-white font-bold py-4 px-12 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="absolute w-0 h-0 transition-all duration-300 rounded-full bg-white opacity-10 group-hover:w-full group-hover:h-full"></span>
              <span className="relative flex items-center">
                Start Shopping
                <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </span>
            </button>
            <p className="text-gray-500 mt-10">© 2025 GreenCart. All rights reserved.</p>
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
        
        .pattern-grid-lg {
          background-image: linear-gradient(currentColor 1px, transparent 1px), linear-gradient(to right, currentColor 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;