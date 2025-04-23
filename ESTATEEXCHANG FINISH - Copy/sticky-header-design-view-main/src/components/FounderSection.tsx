
import React from 'react';

const FounderSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="section-heading text-[hsl(142,64%,38%)]">About Our Founder</h2>
        <div className="max-w-md mx-auto">
          <img 
            src="/placeholder.svg" 
            alt="Founder" 
            className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
          />
          <h3 className="text-xl font-bold mb-2">CHIA PROMISE NSEH</h3>
          <p className="text-gray-700">
            Visionary founder of Estate Exchange, committed to transforming the real estate industry through technology and transparency.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
