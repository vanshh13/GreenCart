import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/blogs';

const Blog = ({ userId, token }) => {
  const [blogs, setBlogs] = useState([]);
  const [commentText, setCommentText] = useState({});

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(API_URL);
      setBlogs(res.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleLike = async (blogId) => {
    try {
      await axios.put(`${API_URL}/like/${blogId}`, { userId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBlogs();
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const handleComment = async (blogId) => {
    if (!commentText[blogId]) return;
    try {
      await axios.post(`${API_URL}/comment/${blogId}`, { userId, text: commentText[blogId] }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCommentText({ ...commentText, [blogId]: '' });
      fetchBlogs();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div>
      {blogs.map((blog) => (
        <div key={blog._id} className="border p-4 my-2">
          <h2>{blog.title}</h2>
          <p>{blog.description}</p>
          {blog.images.length > 0 && <img src={blog.images[0]} alt="Blog" width="200" />}
          <div>
            <button onClick={() => handleLike(blog._id)}>
              {blog.likes.includes(userId) ? 'Unlike' : 'Like'} ({blog.likes.length})
            </button>
          </div>
          <div>
            <input
              type="text"
              value={commentText[blog._id] || ''}
              onChange={(e) => setCommentText({ ...commentText, [blog._id]: e.target.value })}
              placeholder="Add a comment..."
            />
            <button onClick={() => handleComment(blog._id)}>Comment</button>
          </div>
          <div>
            <h4>Comments:</h4>
            {blog.comments.map((comment, idx) => (
              <p key={idx}>{comment.text}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Blog;
