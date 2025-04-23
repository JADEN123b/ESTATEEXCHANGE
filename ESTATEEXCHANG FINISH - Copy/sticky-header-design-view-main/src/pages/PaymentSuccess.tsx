import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import AuthGuard from '../components/AuthGuard';

interface PaymentDetails {
  transactionId: string;
  amount: string;
  date: string;
  purchasedItem: string;
  location: string;
  paymentMethod: string;
}

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const paymentDetails = location.state as PaymentDetails;

  // Automatically redirect after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/property-verification');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center space-y-6">
            <Button
              variant="ghost"
              className="absolute left-4 top-4"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <h1 className="text-3xl font-bold text-green-600">
              Payment Successful!
            </h1>

            <div className="space-y-3 text-gray-600">
              <div>
                <div className="text-sm">Transaction ID:</div>
                <div className="font-medium">{paymentDetails?.transactionId || '1234567890'}</div>
              </div>

              <div>
                <div className="text-sm">Amount:</div>
                <div className="font-medium">${paymentDetails?.amount || '100.00'}</div>
              </div>

              <div>
                <div className="text-sm">Date:</div>
                <div className="font-medium">{paymentDetails?.date || 'April 5, 2025'}</div>
              </div>

              <div>
                <div className="text-sm">Purchased Item:</div>
                <div className="font-medium">{paymentDetails?.purchasedItem || 'Luxury Villa'}</div>
              </div>

              <div>
                <div className="text-sm">Item Location:</div>
                <div className="font-medium">{paymentDetails?.location || 'Miami, FL'}</div>
              </div>

              <div>
                <div className="text-sm">Payment Method:</div>
                <div className="font-medium">{paymentDetails?.paymentMethod || 'Credit Card'}</div>
              </div>
            </div>

            <p className="text-sm text-gray-500 italic">
              Redirecting to property verification in 5 seconds...
            </p>

            <Button
              onClick={() => navigate('/property-verification')}
              className="w-full bg-green-500 hover:bg-green-600 text-white mt-6"
            >
              Continue to Property Verification
            </Button>
          </div>
        </Card>
      </div>
    </AuthGuard>
  );
};

export default PaymentSuccess; 