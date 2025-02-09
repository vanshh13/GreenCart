import { Button } from "../components/ui/Button";

const Categories = () => {
  const categories = [
    "Fruits",
    "Vegetables",
    "Dairy",
    "Bakery",
    "Beverages",
    "Snacks",
    "Organic",
    "Health Foods",
  ];

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-[var(--color-text)]">
        Categories
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <Button
            key={index}
            variant="outline"
            className="h-24 bg-[var(--color-surface)] border-[var(--color-border)] hover:bg-[var(--color-accent)] hover:text-white"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
