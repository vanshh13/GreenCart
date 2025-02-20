import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddBlog = () => {
  const { register, handleSubmit, reset } = useForm();
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Form Submit Handler
  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("image", data.image[0]);
      formData.append("title", data.title);
      formData.append("description", data.description);
      
      const token = localStorage.getItem("token"); // Get auth token

      const response = await axios.post("http://localhost:5000/api/blogs", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Blog added successfully!");
      reset(); // Reset form
      setImagePreview(null);
      navigate("/blogs"); // Redirect to blog list page
    } catch (error) {
      alert("Error adding blog: " + error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add a New Blog</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-medium">Title</label>
          <input
            type="text"
            {...register("title", { required: true })}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-300"
            placeholder="Enter blog title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-medium">Description</label>
          <textarea
            {...register("description", { required: true })}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-300"
            placeholder="Write your blog content..."
          ></textarea>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            {...register("image", { required: true })}
            onChange={handleImageChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-4">
            <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-lg shadow-md" />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Add Blog"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
