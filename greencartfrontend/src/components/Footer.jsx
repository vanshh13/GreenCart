import React, { useState } from "react";
import { Input } from "../components/ui/Input";
import { Star, CheckCircle } from "lucide-react"; // Import missing icons
import { Droplet as Drop, Sprout as Seedling } from "lucide-react";
import { Link } from "react-router-dom";

import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Leaf,
  Heart,
  Clock,
  Shield,
  Key,
  Lock,
  MessageCircle,
  Headphones
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const features = [
    {
      icon: (
        <div className="relative">
          {/* Outer rotating circle */}
          <div className="absolute inset-0 animate-spin-slow">
            <Drop className="w-3 h-3 absolute -top-1 left-1/2 -translate-x-1/2 text-green-300" />
            <Drop className="w-3 h-3 absolute top-1/2 -right-1 -translate-y-1/2 rotate-90 text-green-300" />
            <Drop className="w-3 h-3 absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-180 text-green-300" />
            <Drop className="w-3 h-3 absolute top-1/2 -left-1 -translate-y-1/2 -rotate-90 text-green-300" />
          </div>
          {/* Middle circle with seedlings */}
          <div className="absolute inset-0 animate-pulse">
            <div className="absolute inset-0 rounded-full border-2 border-green-200 border-dashed" />
            <Seedling className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-green-400" />
          </div>
          {/* Center leaf */}
          <Leaf className="w-8 h-8 relative z-10 text-green-500" />
        </div>
      ),
      text: "100% Organic",
      description: "Fresh and natural products",
      accent: "from-green-400 to-emerald-500"
    },
    {
      icon: (
        <div className="relative">
          {/* Outer rotating circle */}
          <div className="absolute inset-0 animate-spin-slow">
            <Key className="w-3 h-3 absolute -top-1 left-1/2 -translate-x-1/2 text-blue-300" />
            <Key className="w-3 h-3 absolute top-1/2 -right-1 -translate-y-1/2 rotate-90 text-blue-300" />
            <Key className="w-3 h-3 absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-180 text-blue-300" />
            <Key className="w-3 h-3 absolute top-1/2 -left-1 -translate-y-1/2 -rotate-90 text-blue-300" />
          </div>
          {/* Middle circle with lock */}
          <div className="absolute inset-0 animate-pulse">
            <div className="absolute inset-0 rounded-full border-2 border-blue-200 border-dashed" />
            <Lock className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-400" />
          </div>
          {/* Center shield */}
          <Shield className="w-8 h-8 relative z-10 text-blue-500" />
        </div>
      ),
      text: "Secure Payment",
      description: "Safe & reliable transactions",
      accent: "from-blue-400 to-indigo-500"
    },
    {
      icon: (
        <div className="relative">
          {/* Outer rotating circle */}
          <div className="absolute inset-0 animate-spin-slow">
            <MessageCircle className="w-3 h-3 absolute -top-1 left-1/2 -translate-x-1/2 text-purple-300" />
            <MessageCircle className="w-3 h-3 absolute top-1/2 -right-1 -translate-y-1/2 rotate-90 text-purple-300" />
            <MessageCircle className="w-3 h-3 absolute -bottom-1 left-1/2 -translate-x-1/2 rotate-180 text-purple-300" />
            <MessageCircle className="w-3 h-3 absolute top-1/2 -left-1 -translate-y-1/2 -rotate-90 text-purple-300" />
          </div>
          {/* Middle circle with phone */}
          <div className="absolute inset-0 animate-pulse">
            <div className="absolute inset-0 rounded-full border-2 border-purple-200 border-dashed" />
            <Phone className="w-4 h-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-400" />
          </div>
          {/* Center headphones */}
          <Headphones className="w-8 h-8 relative z-10 text-purple-500" />
        </div>
      ),
      text: "24/7 Support",
      description: "Always here to help you",
      accent: "from-purple-400 to-violet-500"
    },

  ];
  
  

  const socialLinks = [
    { icon: <Facebook className="w-6 h-6" />, url: "#", color: "hover:text-blue-400" },
    { icon: <Twitter className="w-6 h-6" />, url: "#", color: "hover:text-blue-400" },
    { icon: <Instagram className="w-6 h-6" />, url: "#", color: "hover:text-pink-400" },
    { icon: <Youtube className="w-6 h-6" />, url: "#", color: "hover:text-red-400" },
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => setIsSubscribed(false), 3000);
      setEmail("");
    }
  };

  return (
    <div className="bg-white">      
    {/* Features Section */}
{/* Features Section */}
<div className="border-t border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative overflow-hidden p-8 rounded-3xl bg-white border border-gray-100 transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 active:scale-95 active:bg-opacity-80"
            >
              {/* Animated background gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${feature.accent} opacity-0 group-hover:opacity-5 transition-opacity duration-700 active:opacity-100`}
              />
              
              {/* Star effect */}
              <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                <Star className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>

              {/* Main content */}
              <div className="relative flex flex-col items-center justify-center space-y-6 text-center">
                {/* Icon container with animations */}
                <div className="relative">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.accent} opacity-20 blur-xl group-hover:opacity-30 transition-all duration-700 rounded-full scale-150 active:opacity-40`}
                  />
                  <div className="relative p-5 rounded-full bg-white shadow-lg transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-6">
                    <div
                      className={`bg-gradient-to-r ${feature.accent} bg-clip-text text-transparent`}
                    >
                      {feature.icon}
                    </div>
                  </div>
                </div>

                {/* Text content with animations */}
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-500">
                    {feature.text}
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-500">
                    {feature.description}
                  </p>
                </div>

                {/* Animated learn more button */}
                <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-300">
                    <span>Learn more</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>

                {/* Success check mark */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-300">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              </div>

              {/* Border animation */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-gray-200 rounded-3xl transition-all duration-700 scale-105 group-hover:scale-100" />
            </div>
          ))}
        </div>
      </div>
    </div>

    <footer className="bg-gradient-to-b from-white to-gray-900">

      {/* Main Footer Content */}
      <div className="bg-gray-900/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* About Section */}
            <div className="space-y-6 transform transition-all duration-300 hover:translate-y--1">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                GreenCart
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Your trusted source for organic products. We deliver fresh, organic produce right to your doorstep.
              </p>
              <div className="flex items-center space-x-2 text-green-400">
                <span>Made with</span>
                <Heart className="w-4 h-4 fill-current animate-pulse" />
                <span>for nature</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-green-400">Quick Links</h3>
              <ul className="space-y-4">
  {[
    { name: "About Us", path: "/about" },
    { name: "Products", path: "/products" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/" }
  ].map((link) => (
    <li
      key={link.name}
      className="text-gray-400 hover:text-green-400 cursor-pointer transition-all duration-300 hover:translate-x-2 flex items-center space-x-2"
    >
      <Link to={link.path} className="flex items-center space-x-2 group">
        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span>{link.name}</span>
      </Link>
    </li>
  ))}
</ul>

            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-green-400">Contact Us</h3>
              <div className="space-y-4">
                {[
                  { icon: <Mail className="w-5 h-5" />, text: "support@greencart.com" },
                  { icon: <Phone className="w-5 h-5" />, text: "+1 234 567 890" },
                  { icon: <MapPin className="w-5 h-5" />, text: "123 Green Street, IND" }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3 text-gray-400 hover:text-green-400 transition-colors duration-300">
                    <div className="text-green-400">{item.icon}</div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-green-400">Newsletter</h3>
              <p className="text-gray-400">Subscribe for updates and exclusive offers</p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative group">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pr-10 bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-500 focus:border-green-500 focus:ring-green-500 transition-all duration-300 group-hover:border-green-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-300 transition-all duration-300 hover:scale-110"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                {isSubscribed && (
                  <p className="text-green-400 text-sm animate-fade-in">
                    Thank you for subscribing!
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Social Links & Copyright */}
          <div className="mt-16 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400">
              © {new Date().getFullYear()} GreenCart. All rights reserved.
            </p>
              <div className="flex space-x-8">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    className={`text-gray-400 transition-all duration-300 hover:-translate-y-2 hover:scale-110 ${social.color}`}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default Footer;