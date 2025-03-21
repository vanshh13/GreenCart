import React from "react";
import ThemeUpdater from "../configuration/ThemeContext";
import { ThemeProvider } from "../configuration/CustomizableThemeConfiguration";
import Navigation from "../components/Navigation";
import Carousel from "../components/ui/Carousel";
import OfferPanel from "../product/OfferPanel";
import Categories from "../product/Categories";
import ProductHome from "../product/Product-Home";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ui/ScrollToTop";
import Blog from "../Home/Blog";
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
      {/* <Blog/> */}
      <Footer />
    </div>
    <ScrollToTop/>
  </ThemeProvider>
  
  );
};

export default Homepage;
