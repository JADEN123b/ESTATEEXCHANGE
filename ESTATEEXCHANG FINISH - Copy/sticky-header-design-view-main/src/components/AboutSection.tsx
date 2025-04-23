
import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="section-heading text-[hsl(142,64%,38%)]">About Estate Exchange</h2>
        <p className="text-center max-w-4xl mx-auto text-gray-700">
          Estate Exchange is a platform designed to connect individuals looking to buy, sell, or rent properties. We empower individuals to showcase their listings and find the perfect match. Our mission is to create a transparent and user-friendly environment for all your real estate needs.
        </p>
      </div>
    </section>
  );
};

export default AboutSection;
