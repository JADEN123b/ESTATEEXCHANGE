
import React from 'react';

const ContactSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50" id="contact">
      <div className="container mx-auto px-4 text-center">
        <h2 className="section-heading text-[hsl(142,64%,38%)]">Contact Us</h2>
        <p className="mb-6">Have questions or need assistance? Reach out to us!</p>
        
        <div className="max-w-md mx-auto text-left">
          <p className="mb-2"><strong>Estate Exchange Headquarters</strong></p>
          <p className="mb-2">Mile 3 Bamenda, NW Region, Cameroon</p>
          <p className="mb-2">Email: info@estateexchange.com</p>
          <p className="mb-2">Phone: +237 650775724</p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
