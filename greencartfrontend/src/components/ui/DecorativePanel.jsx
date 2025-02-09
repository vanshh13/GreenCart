import { Leaf, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { ShoppingBasket, Sprout, Apple } from 'lucide-react';

const GreenCartIllustration = () => (
    <svg
      viewBox="0 0 400 300"
      className="w-full max-w-md mb-8"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shopping basket */}
      <path
        d="M100,200 L300,200 L280,280 L120,280 Z"
        fill="#4CAF50"
        stroke="#2E7D32"
        strokeWidth="4"
      />
      <path
        d="M140,200 C140,140 260,140 260,200"
        fill="none"
        stroke="#2E7D32"
        strokeWidth="6"
      />
      
      {/* Vegetables and fruits in basket */}
      <circle cx="160" cy="240" r="20" fill="#FF5722"/> {/* Orange */}
      <circle cx="200" cy="250" r="25" fill="#8BC34A"/> {/* Lettuce */}
      <circle cx="240" cy="235" r="18" fill="#F44336"/> {/* Apple */}
      <path
        d="M180,230 Q200,210 220,230"
        fill="none"
        stroke="#795548"
        strokeWidth="3"
      /> {/* Carrot top */}
    </svg>
  );
  const DecorativePanel = () => (
    <div
      className="hidden lg:flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-green-600 to-green-700 p-8 relative overflow-hidden"
      style={{ clipPath: "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)" }} // Bullet train shape
    >
      {/* Animated background dots */}
      <div className="absolute inset-0" style={{ opacity: 0.1 }}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 10 + 5 + 'px',
              height: Math.random() * 10 + 5 + 'px',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 20}s linear infinite`
            }}
          />
        ))}
      </div>
  
      {/* Main content */}
      <div className="relative z-10 text-center text-white space-y-6">
        <div className="flex items-center justify-center space-x-3 mb-8">
          <ShoppingBasket className="w-16 h-16" />
          <h1 className="text-4xl font-bold tracking-tight">GreenCart</h1>
        </div>
  
        {/* Custom illustration */}
        <GreenCartIllustration />
  
        <div className="max-w-md space-y-4">
          <h2 className="text-2xl font-semibold">
            Fresh & Organic, Delivered to You
          </h2>
          <p className="text-lg text-green-100">
            Join thousands of happy customers who trust GreenCart for their organic shopping needs.
          </p>
        </div>
  
        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <Leaf className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">100% Organic</p>
          </div>
          <div className="text-center">
            <Sprout className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Farm Fresh</p>
          </div>
          <div className="text-center">
            <Apple className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">Quality Assured</p>
          </div>
        </div>
      </div>
  
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-20 text-green-800"
          style={{ opacity: 0.1 }}
        >
          <path
            d="M0,0 C300,20 800,40 1200,20 L1200,120 L0,120 Z"
            fill="currentColor"
          />
        </svg>
      </div>
  
      {/* Floating leaves animation */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: '100%',
            left: `${Math.random() * 100}%`,
            animation: `fall ${Math.random() * 5 + 3}s linear ${Math.random() * 5}s infinite`,
            opacity: 0.7,
          }}
        >
          <Leaf className="w-6 h-6 text-green-300" />
        </div>
      ))}
  
      <style jsx>{`
        @keyframes fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
  
export default DecorativePanel;
