import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Home/BlogStyles.css";

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/blogs/all");
        setBlogs(res.data);
      } catch (err) {
        setError("Failed to fetch blogs. Please try again.");
        console.error("Error fetching blogs:", err);
      }
      setLoading(false);
    };
   
    fetchBlogs();
  }, []);

  // Animation on scroll effect
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
        }
      });
    }, { threshold: 0.1 });
    
    const blogCards = document.querySelectorAll('.blog-card');
    blogCards.forEach(card => {
      observer.observe(card);
    });
    
    return () => {
      blogCards.forEach(card => {
        observer.unobserve(card);
      });
    };
  }, [blogs]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="blog-container">
      <div className="blog-header">
        <div className="header-animation">
          <h2 className="blog-title">Featured Articles</h2>
        </div>
        <p className="blog-subtitle">Discover our latest and greatest content</p>
      </div>
      
      {loading && (
        <div className="loader-container">
          <div className="pulse-loader"></div>
        </div>
      )}
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="blog-list">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div 
              key={blog._id} 
              className={`blog-card ${expandedId === blog._id ? 'expanded' : ''}`}
            >
              {/* Left side - Main Image */}
              <div className="blog-image-section">
                {blog.images && blog.images.length > 0 ? (
                  <div className="image-container">
                    <img 
                      src={blog.images[0].startsWith('http') ? blog.images[0] : `http://localhost:5000/${blog.images[0]}`} 
                      alt={`Featured for ${blog.title}`} 
                      className="blog-featured-image" 
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/800x600?text=Blog+Image";
                      }}
                    />
                    <div className="image-overlay">
                      <div className="blog-category">Article</div>
                    </div>
                  </div>
                ) : (
                  <div className="blog-placeholder-image">
                    <span>No Image Available</span>
                  </div>
                )}
              </div>
              
              {/* Right side - Content */}
              <div className="blog-content-section">
                <div className="blog-meta">
                  <span className="blog-date">{formatDate(blog.datePublished)}</span>
                  {blog.userId && typeof blog.userId === 'object' && blog.userId.name && (
                    <span className="blog-author">
                      <span className="author-avatar">
                        {blog.userId.name.charAt(0).toUpperCase()}
                      </span>
                      {blog.userId.name}
                    </span>
                  )}
                </div>
                
                <h3 className="blog-card-title">{blog.title}</h3>
                
                <p className="blog-description">
                  {expandedId === blog._id 
                    ? blog.description 
                    : blog.description.length > 150 
                      ? `${blog.description.substring(0, 150)}...` 
                      : blog.description}
                </p>
                
                {/* Secondary Images (only when expanded) */}
                {expandedId === blog._id && blog.images && blog.images.length > 1 && (
                  <div className="blog-secondary-images">
                    {blog.images.slice(1, 4).map((img, imgIndex) => (
                      <div className="secondary-image-item" key={imgIndex}>
                        <img 
                          src={img.startsWith('http') ? img : `http://localhost:5000/${img}`} 
                          alt={`Blog image ${imgIndex + 2}`}
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/300x200?text=Image";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="blog-footer">
                  <button 
                    className="read-more-btn"
                    onClick={() => toggleExpand(blog._id)}
                  >
                    {expandedId === blog._id ? 'Read Less' : 'Read More'}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && <div className="no-blogs">No articles found. Check back soon!</div>
        )}
      </div>
    </div>
  );
};

export default Blog;