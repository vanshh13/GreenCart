import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../components/ui/BackButton";
import { getAllBlogsFrontend } from "../api";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await getAllBlogsFrontend();
        setBlogs(res.data);
      } catch (err) {
        setError("Failed to fetch blogs. Please try again.");
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBlogs();
  }, []);  

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  // Get unique categories
  const categories = ["All", ...new Set(blogs.map(blog => blog.category || "Uncategorized"))];
  
  // Filter blogs by category
  const filteredBlogs = activeCategory === "All" 
    ? blogs 
    : blogs.filter(blog => blog.category === activeCategory);

  return (
    <div className="bg-gradient-to-b from-white to-green-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <BackButton/>
      <div className="max-w-7xl mx-auto">
        {/* Fancy Header without underline */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-extrabold text-green-800 mb-4">
            Featured Articles
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our latest and greatest content curated for passionate readers
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                activeCategory === category
                  ? "bg-green-700 text-white shadow-lg transform scale-105"
                  : "bg-white text-green-700 border border-green-300 hover:bg-green-50"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-700"></div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Blog Grid */}
        <div className="space-y-16">
          {filteredBlogs.map((blog, index) => {
            const isExpanded = expandedId === blog._id;
            
            return (
              <div
                key={blog._id}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-12 transform transition-all duration-500 hover:shadow-xl`}
              >
                {/* Image Container - animation tied to expanded state */}
                <div className="md:w-2/5 relative group">
                  <div className={`absolute inset-0 bg-green-700 rounded-lg transform ${
                    isExpanded ? "rotate-6 scale-105" : "rotate-3"
                  } transition-transform duration-500`}></div>
                  <img
                    src={blog.images?.[0] || "https://via.placeholder.com/500x400?text=Blog+Image"}
                    alt={blog.title}
                    className={`relative rounded-lg w-full h-80 object-cover shadow-lg transform transition-all duration-500 ${
                      isExpanded ? "translate-x-2 translate-y-2 brightness-110" : ""
                    }`}
                    onError={(e) => (e.target.src = "https://via.placeholder.com/500x400?text=Image+Not+Available")}
                  />
                  {blog.category && (
                    <span className="absolute top-4 right-4 bg-green-700 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                      {blog.category}
                    </span>
                  )}
                </div>
                
                {/* Content Container */}
                <div className="md:w-3/5 flex flex-col justify-center">
                  <div className="flex items-center mb-4">
                    <div className="h-px bg-green-200 flex-grow mr-4"></div>
                    <span className="text-sm font-medium text-gray-500">{formatDate(blog.datePublished)}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-green-800 mb-4 leading-tight">{blog.title}</h2>
                  <div className="prose prose-green max-w-none mb-6 text-gray-700">
                    <p className="text-lg">
                      {isExpanded
                        ? blog.description
                        : `${blog.description.substring(0, 180)}...`}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="relative overflow-hidden px-6 py-3 bg-green-700 text-white rounded-lg group"
                      onClick={() => toggleExpand(blog._id)}
                    >
                      <span className="relative z-10 font-medium">
                        {isExpanded ? "Read Less" : "Read More"}
                      </span>
                      <span className="absolute bottom-0 left-0 w-full h-0 bg-green-900 transition-all duration-300 group-hover:h-full -z-0"></span>
                    </button>
                    
                    {/* Social Share Icons */}
                    <div className="ml-6 flex space-x-3">
                      {["facebook", "twitter", "linkedin"].map(platform => (
                        <button key={platform} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-green-700 hover:bg-green-50 transition-colors duration-300">
                          <span className="sr-only">Share on {platform}</span>
                          {/* Icon placeholder - you can replace with actual icons */}
                          <div className="w-5 h-5 rounded-full bg-green-700"></div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* No results message */}
        {filteredBlogs.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">No articles found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;