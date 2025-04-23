
import React from 'react';
import { Link } from 'react-router-dom';

const PropertyCard: React.FC<{
  id: number;
  image: string;
  title: string;
  location: string;
  price: string;
}> = ({ id, image, title, location, price }) => {
  return (
    <div className="property-card">
      <img src={image} alt={title} className="property-image" />
      <div className="property-details">
        <h3 className="font-bold text-xl mb-2">{title}</h3>
        <p className="text-gray-600 mb-1">Location: {location}</p>
        <p className="text-gray-600 mb-4">Price: {price}</p>
        <Link to={`/properties/${id}`} className="view-button">View Details</Link>
      </div>
    </div>
  );
};

const FeaturedListings: React.FC = () => {
  const properties = [
    {
      id: 1,
      image: '/placeholder.svg',
      title: 'Beautiful Family Home',
      location: 'City Center',
      price: '$500,000',
    },
    {
      id: 2,
      image: '/placeholder.svg',
      title: 'Modern Apartment',
      location: 'Downtown Area',
      price: '$350,000',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="section-heading text-[hsl(142,64%,38%)]">Featured Listings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/properties" className="text-[hsl(142,64%,38%)] hover:underline">
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListings;
