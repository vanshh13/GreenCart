import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Pencil, Trash, PlusCircle } from "lucide-react";

const ManageBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/blogs");
        setBlogs(response.data);
      } catch (err) {
        setError("Error fetching blogs");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const deleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`);
      setBlogs(blogs.filter((blog) => blog._id !== id));
    } catch (error) {
      alert("Failed to delete blog");
    }
  };

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Manage Blogs</h1>
        <Link to="/admin/blog/add" className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600">
          <PlusCircle className="h-5 w-5" /> Add Blog
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Published Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id} className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <img src={blog.image} alt={blog.title} className="w-16 h-16 rounded-lg object-cover" />
                </td>
                <td className="p-3 font-semibold text-gray-700">{blog.title}</td>
                <td className="p-3 text-gray-600">{new Date(blog.date).toLocaleDateString()}</td>
                <td className="p-3 flex gap-4">
                  <Link to={`/admin/blog/edit/${blog._id}`} className="text-blue-500 hover:text-blue-700">
                    <Pencil className="h-5 w-5" />
                  </Link>
                  <button onClick={() => deleteBlog(blog._id)} className="text-red-500 hover:text-red-700">
                    <Trash className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBlog;
