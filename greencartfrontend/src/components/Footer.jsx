import React from "react";
import { Input } from "../components/ui/Input"; // Ensure this import matches your project structure

const Footer = () => {
  return (
    <footer className="bg-[var(--color-surface)] border-t border-[var(--color-border)] mt-8">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text)]">About Us</h3>
            <p className="mt-2 text-[var(--color-textLight)]">
              Your trusted source for organic products.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text)]">Contact</h3>
            <div className="mt-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-[var(--color-background)] border-[var(--color-border)]"
              />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-text)]">Follow Us</h3>
            <div className="flex space-x-4 mt-2">
              {/* Social media icons would go here */}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
