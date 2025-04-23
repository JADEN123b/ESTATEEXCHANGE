
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
          <div className="max-w-xl mx-auto">
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-2">Estate Exchange Headquarters</h2>
              <p className="mb-2">Mile 3 Bamenda, NW Region, Cameroon</p>
              <p className="mb-2">Email: info@estateexchange.com</p>
              <p className="mb-2">Phone: +237 650775724</p>
            </div>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(142,64%,38%)]" 
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(142,64%,38%)]" 
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                <textarea 
                  id="message" 
                  rows={4} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[hsl(142,64%,38%)]" 
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button type="submit" className="btn-green w-full">Send Message</button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
