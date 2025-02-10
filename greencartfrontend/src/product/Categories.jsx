import { Button } from "../components/ui/Button";

const categories = [
  { name: "Fruits", image: "/images/f.jpg" },
  { name: "Vegetables", image: "/images/v.jpg" },
  { name: "Dairy", image: "/images/d.jpg" },
  { name: "Bakery", image: "/images/b.jpg" },
  { name: "Oil & Ghee", image: "/images/Oil.jpg" },
  { name: "Masala", image: "/images/masala.jpg" },
  { name: "Grain", image: "/images/grain.jpg" },
];

const Categories = () => {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-[var(--color-text)] text-center">
        Categories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-center">
        {categories.map((category, index) => (
          <button
            key={index}
            className="w-64 h-64 rounded-full bg-cover bg-center text-white font-semibold flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-105"
            style={{
              backgroundImage: `url(${category.image})`,
            }}
          >
            <div className="bg-black bg-opacity-50 px-3 py-1 rounded-full text-sm text-center">
              {category.name}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
