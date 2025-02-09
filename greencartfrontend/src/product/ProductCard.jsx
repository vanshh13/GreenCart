import React from "react";
import { Card, CardContent } from "../components/ui/Card"; // Ensure correct path
import { Heart, Star } from "lucide-react";
import { Button } from "../components/ui/Button"; // Ensure correct path

const ProductCard = ({ product }) => {
  return (
    <Card className="bg-[var(--color-background)] border-[var(--color-border)]">
      <div className="relative h-48 bg-[var(--color-surface)]">
        <button className="absolute top-2 right-2 p-1 rounded-full bg-white hover:bg-[var(--color-surface)]">
          <Heart className="h-5 w-5 text-[var(--color-primary)]" />
        </button>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-[var(--color-text)]">{product.name}</h3>
        <div className="flex items-center mt-2">
          <span className="text-[var(--color-primary)] font-bold">${product.price}</span>
          {product.discount && (
            <span className="ml-2 text-sm text-[var(--color-error)] line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
        <div className="flex items-center mt-2">
          <Star className="h-4 w-4 text-[var(--color-warning)] fill-current" />
          <span className="ml-1 text-sm text-[var(--color-textLight)]">{product.rating}</span>
        </div>
        <Button className="w-full mt-4 bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white">
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
