
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="hero-section py-32 mt-16 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Find Your Dream Property with Estate Exchange</h1>
        <p className="text-lg mb-6 max-w-4xl mx-auto">
          ESTATEEXCHANGE is a global real estate market place that aims in revolutionalizing the real industry we facilitate the buying, selling and renting of properties
        </p>
        <p className="text-lg mb-10 max-w-4xl mx-auto">
          SEAT AT YOUR COMFORT ZONE IN YOUR HOUSE AND PURCHASE YOUR DESIRED HOUSE WITHOUT FEAR; Discover a wide range of real estate listings from trusted individuals.
        </p>
        <div className="flex justify-center space-x-4">
          <Link to="/login" className="btn-outline text-white">Login</Link>
          <Link to="/signup" className="btn-green">Sign Up</Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
