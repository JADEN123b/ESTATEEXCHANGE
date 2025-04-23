import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MessageCircle, FileText, HelpCircle, Book } from 'lucide-react';
import { Link } from 'react-router-dom';

const Help: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Help & Support</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Support */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <HelpCircle className="mr-2" /> Quick Support
            </h2>
            <ul className="space-y-4">
              <li>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/faq">
                    <FileText className="mr-2" /> Frequently Asked Questions
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link to="/guides">
                    <Book className="mr-2" /> User Guides
                  </Link>
                </Button>
              </li>
            </ul>
          </Card>

          {/* Contact Support */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="mr-2" /> support@estateexchange.com
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Phone className="mr-2" /> 1-800-ESTATE (378-283)
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="mr-2" /> Live Chat
              </Button>
            </div>
          </Card>

          {/* Common Topics */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Common Topics</h2>
            <ul className="space-y-2">
              <li>
                <Link to="/help/property-transfer" className="text-green-600 hover:underline block">
                  • Property Transfer Process
                </Link>
              </li>
              <li>
                <Link to="/help/verification" className="text-green-600 hover:underline block">
                  • Account Verification
                </Link>
              </li>
              <li>
                <Link to="/help/payments" className="text-green-600 hover:underline block">
                  • Payment Methods
                </Link>
              </li>
              <li>
                <Link to="/help/security" className="text-green-600 hover:underline block">
                  • Security Guidelines
                </Link>
              </li>
              <li>
                <Link to="/help/listings" className="text-green-600 hover:underline block">
                  • Managing Listings
                </Link>
              </li>
            </ul>
          </Card>
        </div>

        {/* Support Hours */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Support Hours</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Phone Support</h3>
              <p className="text-gray-600">Monday - Friday: 9:00 AM - 8:00 PM EST</p>
              <p className="text-gray-600">Saturday: 10:00 AM - 6:00 PM EST</p>
              <p className="text-gray-600">Sunday: Closed</p>
            </div>
            <div>
              <h3 className="font-medium">Live Chat</h3>
              <p className="text-gray-600">24/7 Available</p>
              <p className="text-gray-600">Response time: Within 5 minutes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help; 