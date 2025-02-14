import React from "react";

const blogs = [
  {
    title: "The Benefits of Organic Farming",
    description:
      "Discover how organic farming promotes sustainability, reduces chemicals, and enhances soil health.",
    image: "/images/organic-farming.jpg",
    date: "February 10, 2025",
  },
  {
    title: "Why Choose Organic Vegetables?",
    description:
      "Learn about the health benefits of organic vegetables and why they are a better choice.",
    image: "/images/organic-vegetables.jpg",
    date: "February 5, 2025",
  },
  {
    title: "Top 5 Organic Fruits for a Healthy Life",
    description:
      "Explore the top organic fruits that can boost your health and immunity.",
    image: "/images/organic-fruits.jpg",
    date: "January 28, 2025",
  },
  {
    title: "Organic Dairy Products: Are They Worth It?",
    description:
      "Find out how organic dairy products compare to regular dairy in terms of nutrition and sustainability.",
    image: "/images/organic-dairy.jpg",
    date: "January 20, 2025",
  },
  {
    title: "The Impact of Organic Farming on the Environment",
    description:
      "Learn how organic farming practices help reduce pollution and promote biodiversity.",
    image: "/images/organic-environment.jpg",
    date: "January 15, 2025",
  },
  {
    title: "How to Start Your Own Organic Garden",
    description:
      "Step-by-step guide to growing your own organic vegetables and herbs at home.",
    image: "/images/organic-garden.jpg",
    date: "January 10, 2025",
  },
];

const Blog = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Hero Section */}
        <div
          className="w-full h-[400px] flex items-center justify-center bg-cover bg-center text-white text-5xl font-bold shadow-lg"
          style={{ backgroundImage: "url('http://i.imgur.com/JmPry.jpg')" }}
        >
          Organic Blog
        </div>

        {/* Blog Posts Section */}
        <h2 className="text-4xl font-bold my-10 text-center text-green-700">
          Latest Articles
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="bg-white shadow-xl rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-56 object-cover"
              />
              <div className="p-5">
                <h3 className="text-2xl font-semibold text-gray-800">{blog.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{blog.date}</p>
                <p className="text-gray-700 mt-3">{blog.description}</p>
                <button className="mt-4 bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-700 transition-all">
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default Blog;
