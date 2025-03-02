import React from "react";
import ThemeUpdater from "../configuration/ThemeContext";
import { ThemeProvider } from "../configuration/CustomizableThemeConfiguration";
import Navigation from "../components/Navigation";
import Carousel from "../components/ui/Carousel";
import OfferPanel from "../product/OfferPanel";
import Categories from "../product/Categories";
import ProductHome from "../product/ProductHome";
import Footer from "../components/Footer";

const Homepage = () => {
  return (
    <ThemeProvider>
    <ThemeUpdater />
    <div className="min-h-screen bg-[var(--color-background)]">
      <Navigation />
      <Carousel />
      <OfferPanel />
      <Categories />
      <ProductHome />
      <Footer />
    </div>
  </ThemeProvider>
  
  );
};

export default Homepage;
