
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">About Us</h1>
          <div className="max-w-3xl mx-auto">
            <p className="mb-4">
              Estate Exchange is a platform designed to connect individuals looking to buy, sell, or rent properties. 
              We empower individuals to showcase their listings and find the perfect match.
            </p>
            <p className="mb-4">
              Our mission is to create a transparent and user-friendly environment for all your real estate needs.
              We believe in making real estate transactions simple, secure, and accessible to everyone.
            </p>
            <h2 className="text-2xl font-bold mt-8 mb-4">Our Vision</h2>
            <p className="mb-4">
              To revolutionize the real estate industry by leveraging technology to create seamless connections
              between property buyers, sellers, and renters worldwide.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
